const CARDCOM_API_BASE = "https://secure.cardcom.solutions/api/v11";

export function isCardcomConfigured() {
  return Boolean(process.env.CARDCOM_TERMINAL_NUMBER && process.env.CARDCOM_API_NAME);
}

function credentials() {
  const terminalNumber = process.env.CARDCOM_TERMINAL_NUMBER;
  const apiName = process.env.CARDCOM_API_NAME;
  if (!terminalNumber || !apiName) {
    throw new Error("Cardcom is not configured: set CARDCOM_TERMINAL_NUMBER and CARDCOM_API_NAME");
  }
  return { terminalNumber: Number(terminalNumber), apiName };
}

type CreatePaymentParams = {
  orderId: string;
  orderNumber: string;
  amount: number;
  customerName: string;
  customerEmail?: string;
  successUrl: string;
  failedUrl: string;
  webhookUrl: string;
};

type CardcomCreateResponse = {
  ResponseCode: number;
  Description?: string;
  LowProfileId: string;
  Url: string;
};

// Cardcom LowProfile ("hosted payment page") flow: https://docs.cardcom.solutions
export async function createCardcomPayment(params: CreatePaymentParams) {
  const { terminalNumber, apiName } = credentials();

  const res = await fetch(`${CARDCOM_API_BASE}/LowProfile/Create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      TerminalNumber: terminalNumber,
      ApiName: apiName,
      Operation: "ChargeOnly",
      Amount: params.amount,
      ISOCoinId: 1, // ILS
      ReturnValue: params.orderId,
      ProductName: `הזמנה ${params.orderNumber}`,
      SuccessRedirectUrl: params.successUrl,
      FailedRedirectUrl: params.failedUrl,
      WebHookUrl: params.webhookUrl,
      Document: {
        To: params.customerName,
        Email: params.customerEmail,
      },
    }),
  });

  const data: CardcomCreateResponse = await res.json();
  if (data.ResponseCode !== 0) {
    throw new Error(data.Description || "שגיאה ביצירת עסקת סליקה");
  }
  return { url: data.Url, lowProfileId: data.LowProfileId };
}

type CardcomLpResult = {
  ResponseCode: number;
  Description?: string;
  LowProfileId: string;
  ReturnValue: string;
  TranzactionInfo?: {
    ResponseCode: number;
    Amount: number;
  };
};

// Always re-verify payment status server-side via this call - never trust the
// webhook/redirect payload alone, since both can be replayed or forged.
export async function getCardcomPaymentResult(lowProfileId: string) {
  const { terminalNumber, apiName } = credentials();

  const res = await fetch(`${CARDCOM_API_BASE}/LowProfile/GetLpResult`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      TerminalNumber: terminalNumber,
      ApiName: apiName,
      LowProfileId: lowProfileId,
    }),
  });

  const data: CardcomLpResult = await res.json();
  return data;
}
