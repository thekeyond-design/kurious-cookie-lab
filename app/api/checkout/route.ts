import { NextRequest, NextResponse } from "next/server"
import { stripe, SHIPPING_FEES } from "@/lib/stripe"
import { createServiceClient } from "@/lib/supabase/server"
import { COOKIES } from "@/lib/cookies"
import { BOX_CONFIG } from "@/types"
import type { FulfillmentType } from "@/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      boxSize,
      selectedCookieIds,
      instructions,
      fulfillment,
      customerName,
      customerEmail,
    }: {
      boxSize: number
      selectedCookieIds: string[]
      instructions: string
      fulfillment: FulfillmentType
      customerName: string
      customerEmail: string
    } = body

    // ── Validate inputs ────────────────────────────────────────────────────
    if (!selectedCookieIds?.length)
      return NextResponse.json({ error: "No cookies selected." }, { status: 400 })
    if (!fulfillment)
      return NextResponse.json({ error: "No fulfillment method selected." }, { status: 400 })
    if (!customerName?.trim() || !customerEmail?.trim())
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 })

    // ── Resolve cookie data ────────────────────────────────────────────────
    const selectedCookies = selectedCookieIds
      .map((id) => COOKIES.find((c) => c.id === id))
      .filter(Boolean) as typeof COOKIES

    if (selectedCookies.length !== selectedCookieIds.length)
      return NextResponse.json({ error: "Invalid cookie selection." }, { status: 400 })

    const config = BOX_CONFIG[boxSize]

    // ── Calculate pricing ──────────────────────────────────────────────────
    let subtotalCents: number
    let stripeLineItems: { price_data: { currency: string; product_data: { name: string; description?: string }; unit_amount: number }; quantity: number }[]

    if (boxSize > 0 && config.flatPrice) {
      // Flat-price box
      subtotalCents = config.flatPrice * 100
      stripeLineItems = [{
        price_data: {
          currency: "usd",
          product_data: {
            name: `${config.label} — ${boxSize} Cookies`,
            description: selectedCookies.map((c) => c.name).join(", "),
          },
          unit_amount: subtotalCents,
        },
        quantity: 1,
      }]
    } else {
      // Individual — per cookie
      subtotalCents = selectedCookies.reduce((sum, c) => sum + Math.round(c.price * 100), 0)
      stripeLineItems = selectedCookies.map((c) => ({
        price_data: {
          currency: "usd",
          product_data: { name: c.name, description: c.description },
          unit_amount: Math.round(c.price * 100),
        },
        quantity: 1,
      }))
    }

    const NC_TAX_RATE = 0.0675
    const shippingFeeCents = SHIPPING_FEES[fulfillment] ?? 0
    const taxCents = Math.round(subtotalCents * NC_TAX_RATE)
    const totalCents = subtotalCents + shippingFeeCents + taxCents

    // Add shipping as a line item if applicable
    if (shippingFeeCents > 0) {
      stripeLineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: `Fulfillment — ${fulfillment.replace(/_/g, " ")}` },
          unit_amount: shippingFeeCents,
        },
        quantity: 1,
      })
    }

    // Add NC sales tax as a line item
    stripeLineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: "NC Sales Tax (6.75%)" },
        unit_amount: taxCents,
      },
      quantity: 1,
    })

    // ── Save pending order to Supabase ─────────────────────────────────────
    const supabase = createServiceClient()

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim().toLowerCase(),
        box_size: boxSize,
        fulfillment,
        special_instructions: instructions || null,
        status: "pending",
        subtotal: subtotalCents / 100,
        shipping_fee: shippingFeeCents / 100,
        total: totalCents / 100, // includes tax
      })
      .select()
      .single()

    if (orderError || !order)
      return NextResponse.json({ error: "Failed to create order." }, { status: 500 })

    // Save order items — evenly split quantities for box orders
    const quantityPerFlavor = boxSize > 0
      ? Math.floor(boxSize / selectedCookies.length)
      : 1

    // Get product UUIDs from Supabase
    const slugs = selectedCookies.map((c) => c.slug)
    const { data: products } = await supabase
      .from("products")
      .select("id, slug")
      .in("slug", slugs)

    if (products?.length) {
      await supabase.from("order_items").insert(
        selectedCookies.map((c) => {
          const product = products.find((p) => p.slug === c.slug)
          return {
            order_id: order.id,
            product_id: product!.id,
            quantity: quantityPerFlavor,
            unit_price: c.price,
          }
        })
      )
    }

    // ── Create Stripe Checkout Session ────────────────────────────────────
    const origin = request.headers.get("origin") ?? "http://localhost:3000"

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: stripeLineItems,
      customer_email: customerEmail.trim().toLowerCase(),
      metadata: {
        order_id: order.id,
        customer_name: customerName.trim(),
        fulfillment,
      },
      success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/order`,
    })

    // Store session ID on the order
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
