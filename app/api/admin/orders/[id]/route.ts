import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"
import type { OrderStatus } from "@/types/database"

const VALID_STATUSES: OrderStatus[] = [
  "pending", "confirmed", "baking", "ready",
  "out_for_delivery", "completed", "cancelled",
]

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { status } = body as { status: OrderStatus }

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
