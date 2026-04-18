import { NextRequest, NextResponse } from "next/server"
import { stripe, SHIPPING_FEES } from "@/lib/stripe"
import { createServiceClient } from "@/lib/supabase/server"
import { COOKIES } from "@/lib/cookies"
import { BOX_CONFIG } from "@/types"
import type { FulfillmentType } from "@/types"

const NC_TAX_RATE = 0.0675

type CartItemInput = { boxSize: number; cookieIds: string[] }

function buildLineItemsForBatch(item: CartItemInput): {
  lineItems: { price_data: { currency: string; product_data: { name: string; description?: string }; unit_amount: number }; quantity: number }[]
  subtotalCents: number
} {
  const { boxSize, cookieIds } = item
  const config = BOX_CONFIG[boxSize]
  const cookies = cookieIds.map((id) => COOKIES.find((c) => c.id === id)).filter(Boolean) as typeof COOKIES

  if (boxSize > 0 && config.flatPrice) {
    return {
      lineItems: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: `${config.label} — ${boxSize} Cookies`,
            description: cookies.map((c) => c.name).join(", "),
          },
          unit_amount: config.flatPrice * 100,
        },
        quantity: 1,
      }],
      subtotalCents: config.flatPrice * 100,
    }
  }

  const subtotalCents = cookies.reduce((sum, c) => sum + Math.round(c.price * 100), 0)
  return {
    lineItems: cookies.map((c) => ({
      price_data: {
        currency: "usd",
        product_data: { name: c.name, description: c.description },
        unit_amount: Math.round(c.price * 100),
      },
      quantity: 1,
    })),
    subtotalCents,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      items,
      fulfillment,
      customerName,
      customerEmail,
      instructions,
    }: {
      items: CartItemInput[]
      fulfillment: FulfillmentType
      customerName: string
      customerEmail: string
      instructions?: string
    } = body

    // ── Validate inputs ────────────────────────────────────────────────────
    if (!items?.length)
      return NextResponse.json({ error: "No items in cart." }, { status: 400 })
    if (!fulfillment)
      return NextResponse.json({ error: "No fulfillment method selected." }, { status: 400 })
    if (!customerName?.trim() || !customerEmail?.trim())
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 })

    // ── Build Stripe line items from all cart batches ───────────────────────
    let allLineItems: ReturnType<typeof buildLineItemsForBatch>["lineItems"] = []
    let subtotalCents = 0

    for (const item of items) {
      const { lineItems, subtotalCents: batchCents } = buildLineItemsForBatch(item)
      allLineItems = allLineItems.concat(lineItems)
      subtotalCents += batchCents
    }

    const shippingFeeCents = SHIPPING_FEES[fulfillment] ?? 0
    const taxCents = Math.round(subtotalCents * NC_TAX_RATE)
    const totalCents = subtotalCents + shippingFeeCents + taxCents

    if (shippingFeeCents > 0) {
      allLineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: `Fulfillment — ${fulfillment.replace(/_/g, " ")}` },
          unit_amount: shippingFeeCents,
        },
        quantity: 1,
      })
    }

    allLineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: "NC Sales Tax (6.75%)" },
        unit_amount: taxCents,
      },
      quantity: 1,
    })

    // ── Save pending order to Supabase ─────────────────────────────────────
    const supabase = createServiceClient()
    const email = customerEmail.trim().toLowerCase()

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: customerName.trim(),
        customer_email: email,
        box_size: items.length === 1 ? items[0].boxSize : 0,
        fulfillment,
        special_instructions: instructions?.trim() || null,
        status: "pending",
        subtotal: subtotalCents / 100,
        shipping_fee: shippingFeeCents / 100,
        total: totalCents / 100,
      })
      .select()
      .single()

    if (orderError || !order)
      return NextResponse.json({ error: "Failed to create order." }, { status: 500 })

    // Save all order items across all batches
    const allCookieIds = items.flatMap((i) => i.cookieIds)
    const uniqueSlugs = [...new Set(
      allCookieIds.map((id) => COOKIES.find((c) => c.id === id)?.slug).filter(Boolean) as string[]
    )]
    const { data: products } = await supabase
      .from("products")
      .select("id, slug")
      .in("slug", uniqueSlugs)

    if (products?.length) {
      const orderItemRows = items.flatMap((item) => {
        const { boxSize, cookieIds } = item
        const quantityPer = boxSize > 0 ? Math.floor(boxSize / cookieIds.length) : 1
        return cookieIds.map((id) => {
          const cookie = COOKIES.find((c) => c.id === id)
          const product = products.find((p) => p.slug === cookie?.slug)
          if (!product) return null
          return {
            order_id: order.id,
            product_id: product.id,
            quantity: quantityPer,
            unit_price: cookie!.price,
          }
        }).filter(Boolean)
      }) as { order_id: string; product_id: string; quantity: number; unit_price: number }[]

      if (orderItemRows.length) {
        await supabase.from("order_items").insert(orderItemRows)
      }
    }

    // ── Create Stripe Checkout Session ────────────────────────────────────
    const origin = request.headers.get("origin") ?? "http://localhost:3000"

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: allLineItems,
      customer_email: email,
      metadata: {
        order_id: order.id,
        customer_name: customerName.trim(),
        fulfillment,
      },
      success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
    })

    await supabase
      .from("orders")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", order.id)

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("[checkout]", err)
    return NextResponse.json({ error: "Internal server error." }, { status: 500 })
  }
}
