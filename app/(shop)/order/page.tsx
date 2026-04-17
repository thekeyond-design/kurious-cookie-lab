import { OrderBuilder } from "@/components/order/OrderBuilder"

export const metadata = {
  title: "Build Your Formula | Kurious Cookie Lab",
  description: "Choose your batch size and select your cookie elements.",
}

export default function OrderPage() {
  return <OrderBuilder />
}
