// Builds the "new paid order" email. Pure (no imports, no database) so it can
// be exercised on its own. Every customer-supplied value is HTML-escaped - names,
// addresses and the card message are typed by strangers.

export type NotifyOrder = {
  id: string;
  orderNumber: string;
  totalAmount: number;
  deliveryFee: number;
  discountAmount: number;
  couponCode: string | null;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryDate: Date | null;
  deliveryTimeSlot: string | null;
  cardMessage: string | null;
  customer: { name: string; phone: string; email: string | null };
  items: {
    nameSnapshot: string;
    quantity: number;
    unitPrice: number;
    addOns: { label: string; price: number }[];
  }[];
};

const esc = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const money = (n: number) => `${n} ₪`;

function formatDate(date: Date) {
  return date.toLocaleDateString("he-IL", { timeZone: "Asia/Jerusalem" });
}

export function buildOrderEmail(order: NotifyOrder, adminUrl: string, options: { test?: boolean } = {}) {
  const subject = `${options.test ? "[בדיקה] " : ""}הזמנה חדשה ${order.orderNumber} · ${money(order.totalAmount)}`;

  const itemsSubtotal = order.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  const itemLines = order.items.map((i) => {
    const addOns = i.addOns.length > 0 ? ` (תוספות: ${i.addOns.map((a) => a.label).join(", ")})` : "";
    return {
      text: `${i.nameSnapshot} × ${i.quantity}${addOns} - ${money(i.unitPrice * i.quantity)}`,
      html: `${esc(i.nameSnapshot)} × ${i.quantity}${esc(addOns)}`,
      price: money(i.unitPrice * i.quantity),
    };
  });

  const details: [string, string][] = [
    ["לקוח", order.customer.name],
    ["טלפון", order.customer.phone],
    ...(order.customer.email ? ([["אימייל", order.customer.email]] as [string, string][]) : []),
    ["כתובת", `${order.deliveryAddress}, ${order.deliveryCity}`],
    ...(order.deliveryDate ? ([["תאריך משלוח", formatDate(order.deliveryDate)]] as [string, string][]) : []),
    ...(order.deliveryTimeSlot ? ([["שעה מועדפת", order.deliveryTimeSlot]] as [string, string][]) : []),
    ...(order.cardMessage ? ([["הקדשה", order.cardMessage]] as [string, string][]) : []),
  ];

  const totals: [string, string][] = [
    ["מוצרים", money(itemsSubtotal)],
    ...(order.discountAmount > 0
      ? ([[`הנחה${order.couponCode ? ` (${order.couponCode})` : ""}`, `−${money(order.discountAmount)}`]] as [string, string][])
      : []),
    ["משלוח", money(order.deliveryFee)],
    ["סה\"כ שולם", money(order.totalAmount)],
  ];

  const text = [
    `הזמנה חדשה ${order.orderNumber} - התשלום אושר`,
    "",
    ...details.map(([k, v]) => `${k}: ${v}`),
    "",
    "פריטים:",
    ...itemLines.map((l) => `- ${l.text}`),
    "",
    ...totals.map(([k, v]) => `${k}: ${v}`),
    "",
    `לצפייה בהזמנה: ${adminUrl}`,
  ].join("\n");

  const row = (k: string, v: string, bold = false) =>
    `<tr><td style="padding:6px 0;color:#6E6F5E;vertical-align:top;width:120px">${esc(k)}</td><td style="padding:6px 0;${bold ? "font-weight:600;" : ""}">${esc(v)}</td></tr>`;

  const html = `<!doctype html>
<html lang="he" dir="rtl"><body style="margin:0;padding:24px;background:#FBF9F6;font-family:Arial,Helvetica,sans-serif;color:#1B1D14">
<div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #E5DFD2;border-radius:16px;padding:24px">
<h2 style="margin:0 0 4px;font-size:20px">${options.test ? "[בדיקה] " : ""}הזמנה חדשה</h2>
<p style="margin:0 0 16px;color:#6E6F5E">${esc(order.orderNumber)} · התשלום אושר</p>
<table style="width:100%;border-collapse:collapse;font-size:14px">${details.map(([k, v]) => row(k, v)).join("")}</table>
<hr style="border:none;border-top:1px solid #E5DFD2;margin:16px 0">
<table style="width:100%;border-collapse:collapse;font-size:14px">
${itemLines.map((l) => `<tr><td style="padding:6px 0">${l.html}</td><td style="padding:6px 0;text-align:left;white-space:nowrap">${esc(l.price)}</td></tr>`).join("")}
</table>
<hr style="border:none;border-top:1px solid #E5DFD2;margin:16px 0">
<table style="width:100%;border-collapse:collapse;font-size:14px">${totals.map(([k, v], i) => row(k, v, i === totals.length - 1)).join("")}</table>
<p style="margin:20px 0 0"><a href="${esc(adminUrl)}" style="display:inline-block;background:#333C1E;color:#FBF9F6;text-decoration:none;padding:10px 22px;border-radius:999px;font-size:14px">צפייה בהזמנה</a></p>
</div></body></html>`;

  return { subject, html, text };
}
