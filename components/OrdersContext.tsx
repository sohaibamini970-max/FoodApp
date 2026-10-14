"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const SESSION_KEY = "foodiehub-cart-session";

/* ═════════════════════ TYPES ═════════════════════ */
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type OrderItem = {
  id: number;
  product_id: number | null;
  deal_id: number | null;
  variant_id: number | null;
  product_name: string;
  variant_label: string | null;
  img: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
};

export type Order = {
  id: number;
  order_token: string;
  customer_name: string;
  customer_phone: string;
  delivery_address?: string;
  delivery_city: string;
  total: number;
  subtotal?: number;
  delivery_fee?: number;
  tax?: number;
  discount?: number;
  status: OrderStatus;
  payment_method: string;
  payment_txn_id?: string | null;
  payment_status: string;
  created_at: string;
  items?: OrderItem[];
};

export const STATUS_META: Record<
  OrderStatus,
  { label: string; icon: string; bg: string; color: string }
> = {
  pending: {
    label: "Placed",
    icon: "📝",
    bg: "bg-yellow-500/10 border-yellow-500/30",
    color: "text-yellow-300",
  },
  confirmed: {
    label: "Confirmed",
    icon: "✅",
    bg: "bg-blue-500/10 border-blue-500/30",
    color: "text-blue-300",
  },
  preparing: {
    label: "Preparing",
    icon: "👨‍🍳",
    bg: "bg-orange-500/10 border-orange-500/30",
    color: "text-orange-300",
  },
  out_for_delivery: {
    label: "On the way",
    icon: "🚚",
    bg: "bg-purple-500/10 border-purple-500/30",
    color: "text-purple-300",
  },
  delivered: {
    label: "Delivered",
    icon: "🎉",
    bg: "bg-green-500/10 border-green-500/30",
    color: "text-green-300",
  },
  cancelled: {
    label: "Cancelled",
    icon: "❌",
    bg: "bg-red-500/10 border-red-500/30",
    color: "text-red-300",
  },
};

export const ORDER_STEPS: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
];

/* ═════════════════════ CONTEXT ═════════════════════ */
type OrdersContextType = {
  orders: Order[];
  loading: boolean;
  refresh: () => Promise<void>;
  cancelOrder: (id: number) => Promise<{ ok: boolean; error?: string }>;
  trackOrder: (token: string) => Promise<Order | null>;
};

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(SESSION_KEY) || "";
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { user, authFetch } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      if (user) {
        const res = await authFetch("/api/orders/my");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } else {
        const sid = getSessionId();
        if (sid) {
          const res = await fetch(`${API}/api/orders/session/${sid}`);
          if (res.ok) {
            const data = await res.json();
            setOrders(data.orders || []);
          }
        } else {
          setOrders([]);
        }
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [user, authFetch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const cancelOrder = async (id: number) => {
    try {
      // Only admins can change status via the admin endpoint,
      // but for self-cancel we add a user endpoint. For now use admin.
      const res = await authFetch(`/api/admin/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return { ok: false, error: data.message || "Cancel failed" };
      }
      await refresh();
      return { ok: true };
    } catch {
      return { ok: false, error: "Network error" };
    }
  };

  const trackOrder = async (token: string): Promise<Order | null> => {
    try {
      const res = await fetch(`${API}/api/orders/track/${token}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.order;
    } catch {
      return null;
    }
  };

  return (
    <OrdersContext.Provider
      value={{ orders, loading, refresh, cancelOrder, trackOrder }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}