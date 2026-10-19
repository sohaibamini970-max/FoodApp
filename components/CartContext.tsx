"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const SESSION_KEY = "foodiehub-cart-session";

/* ═════════════════════ TYPES ═════════════════════ */
export type CartItem = {
  id: number; // cart_items.id (line id, not product id)
  product_id: number | null;
  deal_id: number | null;
  variant_id: number | null;
  name: string; // product_name (product name or deal title)
  variant_label: string | null;
  price: number; // unit_price
  oldPrice?: number;
  img: string;
  time: string;
  category: string;
  quantity: number;
  delivery_fee: number;
  tax_percent: number;
};

export type CartSummary = {
  items: CartItem[];
  subtotal: number;
  totalItems: number;
  deliveryFee: number;
  tax: number;
  total: number;
};

type ApiCartItem = {
  id: number;
  product_id: number | null;
  deal_id: number | null;
  variant_id: number | null;
  quantity: number;
  unit_price: number;
  product_name: string;
  variant_label: string | null;
  img: string;
  time: string;
  delivery_fee: number;
  tax_percent: number | string;
  category_name?: string;
  category_slug?: string;
};

type CartContextType = CartSummary & {
  loading: boolean;
  addItem: (input: {
    product_id?: number | null;
    deal_id?: number | null;
    variant_id?: number | null;
    quantity?: number;
  }) => Promise<{ ok: boolean; error?: string }>;
  removeItem: (lineId: number) => Promise<void>;
  updateQuantity: (lineId: number, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refresh: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

/* ═════════════════════ HELPERS ═════════════════════ */
const mapLine = (row: ApiCartItem): CartItem => ({
  id: row.id,
  product_id: row.product_id,
  deal_id: row.deal_id,
  variant_id: row.variant_id,
  name: row.product_name,
  variant_label: row.variant_label,
  price: Number(row.unit_price),
  img: row.img,
  time: row.time || (row.deal_id ? "30 min" : "25 min"),
  category: row.deal_id
    ? "deal"
    : row.category_slug || row.category_name || "",
  quantity: row.quantity,
  delivery_fee: Number(row.delivery_fee) || 0,
  tax_percent: Number(row.tax_percent) || 0,
});

export function getOrCreateSession(): string {
  let sid = localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid =
      "cs_" +
      Date.now().toString(36) +
      Math.random().toString(36).slice(2, 10);
    localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

/* ═════════════════════ PROVIDER ═════════════════════ */
export function CartProvider({ children }: { children: ReactNode }) {
  const { authFetch, user } = useAuth();

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  /* ── Core fetch (authFetch auto-adds JWT + handles 401) ── */
  const call = useCallback(
    async (path: string, opts: RequestInit = {}) => {
      const sid = getOrCreateSession();
      const res = await authFetch(path, {
        ...opts,
        headers: {
          "x-cart-session": sid,
          ...(opts.headers || {}),
        },
      });
      const data = await res.json().catch(() => ({}));
      return { res, data };
    },
    [authFetch]
  );

  /* ── Reload from server ── */
  const refresh = useCallback(async () => {
    const { res, data } = await call("/api/cart");
    if (res.ok && data.cart) {
      setItems((data.cart.items || []).map(mapLine));
    }
  }, [call]);

  /* ── Load on mount + on login ── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (user) {
          // After login, merge any guest cart → user cart
          await call("/api/cart/merge", { method: "POST" });
        }
        if (!cancelled) await refresh();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  /* ═══════════════════ MUTATIONS ═══════════════════ */

  const addItem: CartContextType["addItem"] = async (input) => {
    try {
      // Ensure exactly one of product_id or deal_id is sent
      const hasProduct = input.product_id != null;
      const hasDeal = input.deal_id != null;

      if (!hasProduct && !hasDeal) {
        return { ok: false, error: "No product or deal specified" };
      }
      if (hasProduct && hasDeal) {
        return {
          ok: false,
          error: "Cannot add a product and deal at the same time",
        };
      }

      const { res, data } = await call("/api/cart/items", {
        method: "POST",
        body: JSON.stringify({
          product_id: hasProduct ? input.product_id : null,
          deal_id: hasDeal ? input.deal_id : null,
          variant_id: input.variant_id ?? null,
          quantity: input.quantity ?? 1,
        }),
      });

      if (!res.ok) return { ok: false, error: data.message };
      setItems((data.cart.items || []).map(mapLine));
      return { ok: true };
    } catch {
      return { ok: false, error: "Network error" };
    }
  };

  const removeItem = async (lineId: number) => {
    // Optimistic removal
    setItems((prev) => prev.filter((i) => i.id !== lineId));

    const { res, data } = await call(`/api/cart/items/${lineId}`, {
      method: "DELETE",
    });
    if (res.ok) setItems((data.cart.items || []).map(mapLine));
    else await refresh(); // rollback if failed
  };

  const updateQuantity = async (lineId: number, qty: number) => {
    // Optimistic update for snappy UI
    setItems((prev) => {
      if (qty <= 0) return prev.filter((i) => i.id !== lineId);
      return prev.map((i) =>
        i.id === lineId ? { ...i, quantity: qty } : i
      );
    });

    const { res, data } = await call(`/api/cart/items/${lineId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity: qty }),
    });
    if (res.ok) setItems((data.cart.items || []).map(mapLine));
    else await refresh();
  };

  const clearCart = async () => {
    const { res, data } = await call("/api/cart", { method: "DELETE" });
    if (res.ok) setItems((data.cart.items || []).map(mapLine));
  };

  /* ═══════════════════ DERIVED ═══════════════════ */
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  // Delivery: highest fee among items wins (one trip = one delivery fee)
  const deliveryFee =
    items.length === 0
      ? 0
      : Math.max(0, ...items.map((i) => i.delivery_fee || 0));

  // Tax: sum of (line_total × tax_percent / 100) — per-item weighted
  const tax = Math.round(
    items.reduce(
      (sum, i) => sum + i.price * i.quantity * (i.tax_percent / 100),
      0
    )
  );

  const total = subtotal + deliveryFee + tax;

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        totalItems,
        deliveryFee,
        tax,
        total,
        loading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        refresh,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export const formatPKR = (n: number) => `Rs ${n.toLocaleString("en-PK")}`;
