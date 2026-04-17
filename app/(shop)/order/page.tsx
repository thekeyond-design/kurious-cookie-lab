import { Suspense } from "react"
import { OrderBuilder } from "@/components/order/OrderBuilder"

export const metadata = {
  title: "Build Your Formula | Kurious Cookie Lab",
  description: "Choose your batch size and select your cookie elements.",
}

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "#FAF6F0" }} />}>
      <OrderBuilder />
    </Suspense>
  )
}
