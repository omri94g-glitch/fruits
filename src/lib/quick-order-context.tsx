"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type QuickOrderVariant = {
  id: string;
  label: string;
  price: number;
  servesLabel: string | null;
};

export type QuickOrderProduct = {
  productId: string;
  name: string;
  image: string;
  variants: QuickOrderVariant[];
};

type QuickOrderContextValue = {
  product: QuickOrderProduct | null;
  openWith: (product: QuickOrderProduct) => void;
  close: () => void;
};

const QuickOrderContext = createContext<QuickOrderContextValue | null>(null);

export function QuickOrderProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<QuickOrderProduct | null>(null);

  return (
    <QuickOrderContext.Provider
      value={{
        product,
        openWith: (p) => setProduct(p),
        close: () => setProduct(null),
      }}
    >
      {children}
    </QuickOrderContext.Provider>
  );
}

export function useQuickOrder() {
  const ctx = useContext(QuickOrderContext);
  if (!ctx) throw new Error("useQuickOrder must be used within a QuickOrderProvider");
  return ctx;
}
