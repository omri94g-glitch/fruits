"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function PurchaseTracker({ orderNumber }: { orderNumber: string }) {
  useEffect(() => {
    trackEvent("purchase", { transaction_id: orderNumber });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber]);

  return null;
}
