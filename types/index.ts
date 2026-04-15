// ─── Cookie / Product ────────────────────────────────────────────────────────

export type CookieGroup = "classic" | "seasonal" | "custom" | "limited"

export interface Cookie {
  id: string
  slug: string
  name: string
  symbol: string        // e.g. "Cc", "PbO"
  atomicNumber: number  // display order on periodic table
  group: CookieGroup
  description: string
  price: number         // individual unit price in dollars
  isActive: boolean
  isUnstable: boolean   // seasonal/limited — "unstable element"
  imageUrl?: string
}

// ─── Order Builder ───────────────────────────────────────────────────────────

export type BoxSize = 0 | 6 | 12 | 20 | 26 | 32
// 0 = individual (no box), otherwise box of N

export const BOX_CONFIG: Record<number, { label: string; maxFlavors: number; flatPrice: number | null; featured: boolean }> = {
  0:  { label: "Individual",      maxFlavors: 2, flatPrice: null, featured: true },
  6:  { label: "Starter Formula", maxFlavors: 2, flatPrice: 24,   featured: true },
  12: { label: "Lab Formula",     maxFlavors: 3, flatPrice: 48,   featured: true },
  20: { label: "Advanced Compound", maxFlavors: 4, flatPrice: null, featured: false },
  26: { label: "Complex Compound",  maxFlavors: 5, flatPrice: null, featured: false },
  32: { label: "Full Synthesis",    maxFlavors: 6, flatPrice: null, featured: false },
}

export interface OrderItem {
  cookie: Cookie
  quantity: number
}

export type FulfillmentType = "pickup" | "local_delivery" | "nc_shipping" | "national_shipping"

export interface OrderDraft {
  boxSize: BoxSize
  items: OrderItem[]
  fulfillment: FulfillmentType | null
  specialInstructions: string
}

// ─── Checkout / Order ────────────────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "baking"
  | "ready"
  | "out_for_delivery"
  | "completed"
  | "cancelled"

export interface Order {
  id: string
  createdAt: string
  status: OrderStatus
  items: OrderItem[]
  boxSize: BoxSize
  fulfillment: FulfillmentType
  specialInstructions?: string
  subtotal: number
  shippingFee: number
  total: number
  stripePaymentIntentId?: string
  customerEmail: string
  customerName: string
}

// ─── Events ──────────────────────────────────────────────────────────────────

export interface LabEvent {
  id: string
  title: string
  date: string
  location: string
  description: string
  isPublished: boolean
}
