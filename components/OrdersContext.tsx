"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { CartItem } from "./CartContext";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "on-the-way"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  userName: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  address: string;
  paymentMethod: string;
  promoCode?: string;
};

type OrdersContextType = {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "createdAt" | "status">) => Order;
  updateStatus: (id: string, status: OrderStatus) => void;
  getOrder: (id: string) => Order | undefined;
  clearOrders: () => void;
};

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);
const KEY = "foodiehub-orders";

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);

  /* ---- Load from localStorage ---- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setOrders(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  /* ---- Persist to localStorage ---- */
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(KEY, JSON.stringify(orders));
    }
  }, [orders, hydrated]);

  /* ---- Add order (prepends to top) ---- */
  const addOrder = (data: Omit<Order, "id" | "createdAt" | "status">) => {
    const order: Order = {
      ...data,
      id: `ORD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    setOrders((prev) => [order, ...prev]);
    return order;
  };

  /* ---- Update status ---- */
  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  const getOrder = (id: string) => orders.find((o) => o.id === id);

  const clearOrders = () => setOrders([]);

  return (
    <OrdersContext.Provider
      value={{ orders, addOrder, updateStatus, getOrder, clearOrders }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) {
    return {
      orders: [],
      addOrder: () => ({} as Order),
      updateStatus: () => {},
      getOrder: () => undefined,
      clearOrders: () => {},
    } as OrdersContextType;
  }
  return ctx;
}

/* ---- Status metadata ---- */
export const STATUS_META: Record<
  OrderStatus,
  { label: string; icon: string; color: string; bg: string }
> = {
  pending: {
    label: "Pending",
    icon: "⏳",
    color: "text-yellow-300",
    bg: "bg-yellow-500/20 border-yellow-500/30",
  },
  confirmed: {
    label: "Confirmed",
    icon: "✅",
    color: "text-blue-300",
    bg: "bg-blue-500/20 border-blue-500/30",
  },
  preparing: {
    label: "Preparing",
    icon: "👨‍🍳",
    color: "text-orange-300",
    bg: "bg-orange-500/20 border-orange-500/30",
  },
  "on-the-way": {
    label: "On the Way",
    icon: "🛵",
    color: "text-cyan-300",
    bg: "bg-cyan-500/20 border-cyan-500/30",
  },
  delivered: {
    label: "Delivered",
    icon: "🎉",
    color: "text-green-300",
    bg: "bg-green-500/20 border-green-500/30",
  },
  cancelled: {
    label: "Cancelled",
    icon: "❌",
    color: "text-red-300",
    bg: "bg-red-500/20 border-red-500/30",
  },
};

export const ORDER_STEPS: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "on-the-way",
  "delivered",
];