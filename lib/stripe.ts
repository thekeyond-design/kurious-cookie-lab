import Stripe from "stripe"

// Singleton — reuse across hot reloads in dev
const globalForStripe = globalThis as unknown as { stripe: Stripe | undefined }

export const stripe =
  globalForStripe.stripe ??
  new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
  })

if (process.env.NODE_ENV !== "production") globalForStripe.stripe = stripe

// Shipping fees in cents — update when client confirms rates
export const SHIPPING_FEES: Record<string, number> = {
  pickup:            0,
  local_delivery:    500,   // $5.00 — placeholder
  nc_shipping:       800,   // $8.00 — placeholder
}
