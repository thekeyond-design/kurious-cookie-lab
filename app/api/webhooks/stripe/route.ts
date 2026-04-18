import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createServiceClient } from "@/lib/supabase/server"
import { sendOrderConfirmation, sendAdminNotification } from "@/lib/email"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 })
  }

  const supabase = createServiceClient()

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = session.metadata?.order_id

        if (!orderId) break

        const { data: order } = await supabase
          .from("orders")
          .update({
            status: "confirmed",
            stripe_payment_intent_id: session.payment_intent as string ?? null,
          })
          .eq("id", orderId)
          .select("*, order_items(quantity, unit_price, products(name))")
          .single()

        // Send confirmation + admin notification emails
        if (order) {
          const cookieNames: string[] = (order.order_items ?? []).flatMap((item: {
            quantity: number
            products: { name: string } | null
          }) =>
            item.products ? Array(item.quantity).fill(item.products.name) : []
          )

          const emailData = {
            orderId: order.id,
            customerName: order.customer_name,
            customerEmail: order.customer_email,
            fulfillment: order.fulfillment,
            cookieNames,
            subtotal: order.subtotal,
            shippingFee: order.shipping_fee,
            total: order.total,
            specialInstructions: order.special_instructions,
          }

          await Promise.all([
            sendOrderConfirmation(emailData),
            sendAdminNotification(emailData),
          ])
        }
        break
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = session.metadata?.order_id

        if (!orderId) break

        await supabase
          .from("orders")
          .update({ status: "cancelled" })
          .eq("id", orderId)
          .eq("status", "pending")

        break
      }
    }
  } catch (err) {
    console.error("[webhook] Handler error:", err)
    return NextResponse.json({ error: "Handler failed." }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

