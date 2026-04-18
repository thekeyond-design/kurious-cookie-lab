import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const BRAND = {
  pink:  "#FF3DA0",
  navy:  "#1a1a4e",
  teal:  "#3EC9C9",
  cream: "#FAF6F0",
}

const FULFILLMENT_LABELS: Record<string, string> = {
  pickup:         "Pickup",
  local_delivery: "Local Delivery (+$5.00)",
  nc_shipping:    "NC Shipping (+$8.00)",
}

interface OrderEmailData {
  orderId: string
  customerName: string
  customerEmail: string
  fulfillment: string
  cookieNames: string[]
  subtotal: number
  shippingFee: number
  total: number
  specialInstructions?: string | null
}

function baseTemplate(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.cream};font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.cream};padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:${BRAND.navy};padding:28px 32px;text-align:center;">
            <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:0.02em;">
              Kurious<span style="color:${BRAND.pink};">Cookie</span><span style="color:rgba(255,255,255,0.4);"> Lab</span>
            </p>
          </td>
        </tr>

        <!-- Body -->
        ${body}

        <!-- Footer -->
        <tr>
          <td style="background:${BRAND.cream};padding:20px 32px;text-align:center;border-top:1px solid rgba(0,0,0,0.06);">
            <p style="margin:0;font-size:11px;color:rgba(0,0,0,0.35);line-height:1.6;">
              Kurious Cookie Lab · Guilford County, NC<br/>
              Questions? Reply to this email or DM us on Instagram.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function statRow(label: string, value: string, bold = false) {
  return `<tr>
    <td style="padding:4px 0;font-size:13px;color:rgba(0,0,0,0.5);">${label}</td>
    <td style="padding:4px 0;font-size:13px;color:${bold ? BRAND.navy : "rgba(0,0,0,0.7)"};font-weight:${bold ? "700" : "400"};text-align:right;">${value}</td>
  </tr>`
}

/* ─── Customer confirmation ─────────────────────────────────────────────────── */
export async function sendOrderConfirmation(data: OrderEmailData) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_your-api-key-here") return

  const cookieList = data.cookieNames
    .map((n) => `<li style="padding:3px 0;color:rgba(0,0,0,0.65);font-size:14px;">${n}</li>`)
    .join("")

  const body = `
    <tr><td style="padding:32px 32px 8px;">
      <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:${BRAND.pink};text-transform:uppercase;letter-spacing:0.12em;">Order Confirmed</p>
      <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:${BRAND.navy};line-height:1.2;">
        Your batch is locked in, ${data.customerName.split(" ")[0]}!
      </h1>
      <p style="margin:0;font-size:15px;color:rgba(0,0,0,0.55);line-height:1.6;">
        We've got your order and we're on it. You'll hear from us when it's ready.
      </p>
    </td></tr>

    <tr><td style="padding:16px 32px;">
      <div style="background:${BRAND.cream};border-radius:12px;padding:20px 24px;">
        <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:rgba(0,0,0,0.35);text-transform:uppercase;letter-spacing:0.1em;">Your Elements</p>
        <ul style="margin:0;padding-left:18px;line-height:1.8;">${cookieList}</ul>
      </div>
    </td></tr>

    <tr><td style="padding:8px 32px 24px;">
      <div style="background:${BRAND.cream};border-radius:12px;padding:20px 24px;">
        <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:rgba(0,0,0,0.35);text-transform:uppercase;letter-spacing:0.1em;">Order Summary</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${statRow("Fulfillment", FULFILLMENT_LABELS[data.fulfillment] ?? data.fulfillment)}
          ${statRow("Subtotal", `$${data.subtotal.toFixed(2)}`)}
          ${data.shippingFee > 0 ? statRow("Fulfillment fee", `$${data.shippingFee.toFixed(2)}`) : ""}
          ${statRow("NC Sales Tax (6.75%)", `$${(data.total - data.subtotal - data.shippingFee).toFixed(2)}`)}
          <tr><td colspan="2" style="padding-top:10px;border-top:1px solid rgba(0,0,0,0.08);"></td></tr>
          ${statRow("Total charged", `$${data.total.toFixed(2)}`, true)}
        </table>
        ${data.specialInstructions ? `<p style="margin:12px 0 0;font-size:12px;color:rgba(0,0,0,0.4);font-style:italic;">Note: ${data.specialInstructions}</p>` : ""}
      </div>
    </td></tr>

    <tr><td style="padding:0 32px 32px;">
      <p style="margin:0;font-size:13px;color:rgba(0,0,0,0.45);line-height:1.7;">
        Order ref: <span style="font-family:monospace;color:${BRAND.navy};font-size:12px;">${data.orderId.slice(0, 8).toUpperCase()}</span>
      </p>
    </td></tr>`

  await resend.emails.send({
    from: "Kurious Cookie Lab <orders@kuriouscookielab.com>",
    to: data.customerEmail,
    subject: `Order confirmed — your batch is in the lab! 🍪`,
    html: baseTemplate("Order Confirmed — Kurious Cookie Lab", body),
  })
}

/* ─── Admin new-order notification ─────────────────────────────────────────── */
export async function sendAdminNotification(data: OrderEmailData) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_your-api-key-here") return

  const adminEmails = (process.env.ADMIN_EMAIL ?? "")
    .split(",").map((e) => e.trim()).filter(Boolean)
  if (!adminEmails.length) return

  const cookieList = data.cookieNames
    .map((n) => `<li style="padding:2px 0;font-size:14px;color:rgba(0,0,0,0.7);">${n}</li>`)
    .join("")

  const body = `
    <tr><td style="padding:28px 32px 8px;">
      <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:${BRAND.teal};text-transform:uppercase;letter-spacing:0.12em;">New Order</p>
      <h1 style="margin:0 0 6px;font-size:24px;font-weight:800;color:${BRAND.navy};">
        $${data.total.toFixed(2)} · ${FULFILLMENT_LABELS[data.fulfillment] ?? data.fulfillment}
      </h1>
      <p style="margin:0;font-size:14px;color:rgba(0,0,0,0.5);">
        From <strong style="color:${BRAND.navy};">${data.customerName}</strong> · ${data.customerEmail}
      </p>
    </td></tr>

    <tr><td style="padding:12px 32px 24px;">
      <div style="background:${BRAND.cream};border-radius:12px;padding:18px 22px;">
        <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:rgba(0,0,0,0.35);text-transform:uppercase;letter-spacing:0.1em;">Elements Ordered</p>
        <ul style="margin:0;padding-left:18px;line-height:1.8;">${cookieList}</ul>
        ${data.specialInstructions ? `<p style="margin:12px 0 0;font-size:12px;color:rgba(0,0,0,0.45);border-top:1px solid rgba(0,0,0,0.07);padding-top:10px;">📝 ${data.specialInstructions}</p>` : ""}
      </div>
    </td></tr>

    <tr><td style="padding:0 32px 28px;">
      <p style="margin:0;font-size:12px;color:rgba(0,0,0,0.35);font-family:monospace;">
        Order ID: ${data.orderId}
      </p>
    </td></tr>`

  await resend.emails.send({
    from: "Kurious Cookie Lab <orders@kuriouscookielab.com>",
    to: adminEmails,
    subject: `🍪 New order — $${data.total.toFixed(2)} · ${data.customerName}`,
    html: baseTemplate("New Order — Kurious Cookie Lab", body),
  })
}
