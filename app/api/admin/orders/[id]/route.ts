import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
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
  // Defense-in-depth: verify caller is the admin even if middleware is bypassed
  const anonClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => request.cookies.getAll(), setAll: () => {} } }
  )
  const { data: { user } } = await anonClient.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

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
