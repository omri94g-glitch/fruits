"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItemAddOn = { id: string; label: string; price: number };

export type CartItem = {
  productId: string;
  variantId: string;
  name: string;
  variantLabel: string;
  price: number;
  image: string;
  quantity: number;
  addOns: CartItemAddOn[];
};

type DeliveryInfo = {
  deliveryDate: string;
  deliveryCity: string;
  cardMessage: string;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity" | "addOns"> & { addOns?: CartItemAddOn[] }, quantity?: number) => void;
  removeItem: (productId: string, variantId: string, addOnIds?: string) => void;
  updateQuantity: (productId: string, variantId: string, addOnIds: string, quantity: number) => void;
  clear: () => void;
  itemCount: number;
  subtotal: number;

  delivery: DeliveryInfo;
  setDelivery: (patch: Partial<DeliveryInfo>) => void;

  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "rfruits-cart";
const DELIVERY_STORAGE_KEY = "rfruits-cart-delivery";

const emptyDelivery: DeliveryInfo = { deliveryDate: "", deliveryCity: "", cardMessage: "" };

function addOnsKey(addOns: CartItemAddOn[]) {
  return addOns
    .map((a) => a.id)
    .sort()
    .join(",");
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [delivery, setDeliveryState] = useState<DeliveryInfo>(emptyDelivery);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setItems(
          Array.isArray(parsed)
            ? parsed.map((i: CartItem) => ({ ...i, addOns: i.addOns ?? [] }))
            : []
        );
      } catch {
        // ignore corrupted cart data
      }
    }
    const rawDelivery = localStorage.getItem(DELIVERY_STORAGE_KEY);
    if (rawDelivery) {
      try {
        setDeliveryState({ ...emptyDelivery, ...JSON.parse(rawDelivery) });
      } catch {
        // ignore corrupted delivery data
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(DELIVERY_STORAGE_KEY, JSON.stringify(delivery));
  }, [delivery, hydrated]);

  const addItem: CartContextValue["addItem"] = (item, quantity = 1) => {
    const addOns = item.addOns ?? [];
    const key = addOnsKey(addOns);
    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.productId === item.productId &&
          i.variantId === item.variantId &&
          addOnsKey(i.addOns) === key
      );
      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, addOns, quantity }];
    });
  };

  const removeItem: CartContextValue["removeItem"] = (productId, variantId, addOnIds = "") => {
    setItems((prev) =>
      prev.filter(
        (i) =>
          !(i.productId === productId && i.variantId === variantId && addOnsKey(i.addOns) === addOnIds)
      )
    );
  };

  const updateQuantity: CartContextValue["updateQuantity"] = (
    productId,
    variantId,
    addOnIds,
    quantity
  ) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId && i.variantId === variantId && addOnsKey(i.addOns) === addOnIds
            ? { ...i, quantity }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const clear = () => {
    setItems([]);
    setDeliveryState(emptyDelivery);
  };

  const setDelivery: CartContextValue["setDelivery"] = (patch) =>
    setDeliveryState((prev) => ({ ...prev, ...patch }));

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );
  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, i) =>
          sum + i.quantity * (i.price + i.addOns.reduce((a, addOn) => a + addOn.price, 0)),
        0
      ),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clear,
        itemCount,
        subtotal,
        delivery,
        setDelivery,
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
