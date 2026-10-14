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
  userEmail: string;
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
  getOrdersByUser: (email: string) => Order[];
};

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);
const KEY = "foodiehub-orders";

// Seed orders across different users
const SEED: Order[] = [
  {
    id: "ORD-2025-001",
    userEmail: "john@example.com",
    userName: "John Doe",
    items: [
      {
        id: 1,
        name: "Double Cheeseburger",
        price: 1299,
        oldPrice: 1699,
        img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80",
        time: "25 min",
        category: "burgers",
        quantity: 2,
      },
      {
        id: 5,
        name: "Fresh Berry Smoothie",
        price: 699,
        oldPrice: 899,
        img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&q=80",
        time: "15 min",
        category: "drinks",
        quantity: 1,
      },
    ],
    subtotal: 3297,
    deliveryFee: 0,
    tax: 165,
    discount: 0,
    total: 3462,
    status: "delivered",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    estimatedDelivery: new Date(Date.now() - 86400000 * 2 + 1800000).toISOString(),
    address: "House 12, Street 5, DHA Phase 6, Karachi",
    paymentMethod: "Card •••• 4242",
  },
  {
    id: "ORD-2025-002",
    userEmail: "john@example.com",
    userName: "John Doe",
    items: [
      {
        id: 2,
        name: "Pepperoni Pizza",
        price: 1599,
        oldPrice: 1999,
        img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80",
        time: "30 min",
        category: "pizza",
        quantity: 1,
      },
      {
        id: 4,
        name: "Chocolate Lava Cake",
        price: 899,
        oldPrice: 1199,
        img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&q=80",
        time: "20 min",
        category: "desserts",
        quantity: 2,
      },
    ],
    subtotal: 3397,
    deliveryFee: 0,
    tax: 170,
    discount: 340,
    total: 3227,
    status: "on-the-way",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    estimatedDelivery: new Date(Date.now() + 900000).toISOString(),
    address: "House 12, Street 5, DHA Phase 6, Karachi",
    paymentMethod: "Cash on Delivery",
    promoCode: "FOODIE10",
  },
  {
    id: "ORD-2025-003",
    userEmail: "john@example.com",
    userName: "John Doe",
    items: [
      {
        id: 3,
        name: "Salmon Sushi Set",
        price: 2299,
        oldPrice: 2899,
        img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&q=80",
        time: "35 min",
        category: "sushi",
        quantity: 1,
      },
    ],
    subtotal: 2299,
    deliveryFee: 199,
    tax: 115,
    discount: 0,
    total: 2613,
    status: "preparing",
    createdAt: new Date(Date.now() - 600000).toISOString(),
    estimatedDelivery: new Date(Date.now() + 1500000).toISOString(),
    address: "House 12, Street 5, DHA Phase 6, Karachi",
    paymentMethod: "Card •••• 4242",
  },
  // Other user's order
  {
    id: "ORD-2025-004",
    userEmail: "sarah@example.com",
    userName: "Sarah Smith",
    items: [
      {
        id: 4,
        name: "Chocolate Lava Cake",
        price: 899,
        oldPrice: 1199,
        img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&q=80",
        time: "20 min",
        category: "desserts",
        quantity: 3,
      },
    ],
    subtotal: 2697,
    deliveryFee: 199,
    tax: 135,
    discount: 0,
    total: 3031,
    status: "pending",
    createdAt: new Date(Date.now() - 300000).toISOString(),
    estimatedDelivery: new Date(Date.now() + 2100000).toISOString(),
    address: "Flat 3B, Sea View Apartments, Clifton, Karachi",
    paymentMethod: "Cash on Delivery",
  },
];

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setOrders(JSON.parse(raw));
      else setOrders(SEED);
    } catch {
      setOrders(SEED);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(orders));
  }, [orders, hydrated]);

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

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  const getOrder = (id: string) => orders.find((o) => o.id === id);

  const getOrdersByUser = (email: string) =>
    orders.filter((o) => o.userEmail === email);

  return (
    <OrdersContext.Provider
      value={{ orders, addOrder, updateStatus, getOrder, getOrdersByUser }}
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
      getOrdersByUser: () => [],
    } as OrdersContextType;
  }
  return ctx;
}

/* Shared status metadata */
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