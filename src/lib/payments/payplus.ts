// PayPlus hosted "Payment Page" flow. Docs: https://docs.payplus.co.il
//
// Same shape as cardcom.ts: create a hosted payment link, let the customer
// pay there, then re-verify status server-side via getPayPlusTransactionStatus
// before trusting a webhook or redirect - never trust either payload alone.

const PAYPLUS_API_BASE =
  process.env.PAYPLUS_ENV === "production"
    ? "https://restapi.payplus.co.il/api/v1.0"
    : "https://restapidev.payplus.co.il/api/v1.0"; // staging/sandbox

export function isPayPlusConfigured() {
  return Boolean(
    process.env.PAYPLUS_API_KEY &&
      process.env.PAYPLUS_SECRET_KEY &&
      process.env.PAYPLUS_PAYMENT_PAGE_UID
  );
}

function credentials() {
  const apiKey = process.env.PAYPLUS_API_KEY;
  const secretKey = process.env.PAYPLUS_SECRET_KEY;
  const paymentPageUid = process.env.PAYPLUS_PAYMENT_PAGE_UID;
  if (!apiKey || !secretKey || !paymentPageUid) {
    throw new Error(
      "PayPlus is not configured: set PAYPLUS_API_KEY, PAYPLUS_SECRET_KEY, PAYPLUS_PAYMENT_PAGE_UID"
    );
  }
  return { apiKey, secretKey, paymentPageUid };
}

function authHeaders() {
  const { apiKey, secretKey } = credentials();
  return {
    "Content-Type": "application/json",
    "api-key": apiKey,
    "secret-key": secretKey,
  };
}

type CreatePaymentParams = {
  orderId: string;
  orderNumber: string;
  amount: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  successUrl: string;
  failedUrl: string;
  webhookUrl: string;
};

type PayPlusGenerateLinkResponse = {
  results: { status: string; code: number; description?: string };
  data?: {
    page_request_uid: string;
    payment_page_link: string;
    qr_code_image?: string;
  };
};

// https://docs.payplus.co.il/reference/post_paymentpages-generatelink
export async function createPayPlusPayment(params: CreatePaymentParams) {
  const { paymentPageUid } = credentials();

  const res = await fetch(`${PAYPLUS_API_BASE}/PaymentPages/generateLink`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      payment_page_uid: paymentPageUid,
      amount: params.amount,
      currency_code: "ILS",
      sendEmailApproval: true,
      sendEmailFailure: false,
      more_info: params.orderId, // used to match the callback/lookup back to our order
      more_info_1: params.orderNumber,
      customer: {
        customer_name: params.customerName,
        email: params.customerEmail || "",
        phone: params.customerPhone || "",
      },
      refURL_success: params.successUrl,
      refURL_failure: params.failedUrl,
      refURL_callback: params.webhookUrl,
    }),
  });

  const data: PayPlusGenerateLinkResponse = await res.json();
  if (data.results?.code !== 0 || !data.data) {
    throw new Error(data.results?.description || "שגיאה ביצירת עסקת סליקה");
  }
  return { url: data.data.payment_page_link, transactionUid: data.data.page_request_uid };
}

type PayPlusTransactionViewResponse = {
  results: { status: string; code: number; description?: string };
  data?: Array<{
    transaction: {
      uid: string;
      status_code: string; // "000" = approved
      amount: number;
      currency: string;
      more_info?: string; // our orderId, as sent in createPayPlusPayment
      approval_number?: string;
      transaction_is_cancelled?: boolean;
    };
  }>;
};

// Always re-verify payment status server-side via this call - never trust the
// webhook/redirect payload alone, since both can be replayed or forged.
export async function getPayPlusTransactionStatus(transactionUid: string) {
  const res = await fetch(`${PAYPLUS_API_BASE}/Transactions/View`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ transaction_uid: transactionUid }),
  });

  const data: PayPlusTransactionViewResponse = await res.json();
  const transaction = data.data?.[0]?.transaction;
  if (!transaction) {
    throw new Error(data.results?.description || "לא נמצאה עסקה תואמת");
  }

  return {
    approved: transaction.status_code === "000" && !transaction.transaction_is_cancelled,
    amount: transaction.amount,
    currency: transaction.currency,
    orderId: transaction.more_info,
    approvalNumber: transaction.approval_number,
  };
}

// https://docs.payplus.co.il/reference/validate-requests-received-from-payplus
// PayPlus signs each callback body with HMAC-SHA256(secretKey, rawJsonBody),
// base64-encoded, sent in the `hash` header. Always verify this before acting
// on a webhook payload - compare with a timing-safe check, not `===`.
export async function verifyPayPlusWebhookSignature(rawBody: string, hashHeader: string | null) {
  if (!hashHeader) return false;
  const { secretKey } = credentials();

  const crypto = await import("node:crypto");
  const expected = crypto.createHmac("sha256", secretKey).update(rawBody).digest("base64");

  const a = Buffer.from(expected);
  const b = Buffer.from(hashHeader);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
