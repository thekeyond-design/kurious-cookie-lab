import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createServiceClient } from "@/lib/supabase/server"
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

        await supabase
          .from("orders")
          .update({
            status: "confirmed",
            stripe_payment_intent_id: session.payment_intent as string ?? null,
          })
          .eq("id", orderId)

        // TODO: send confirmation email via Resend when RESEND_API_KEY is set
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

// Stripe sends raw bodies — Next.js must not parse them
export const config = { api: { bodyParser: false } }
