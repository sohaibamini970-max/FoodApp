"use client";

import { useEffect, useState } from "react";

export default function OrderTrackingContent({
  token,
}: {
  token: string;
}) {
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrder() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders/track/${encodeURIComponent(token)}`
        );

        if (!response.ok) {
          throw new Error("Unable to find this order.");
        }

        const data = await response.json();
        setOrder(data.order);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      }
    }

    loadOrder();
  }, [token]);

  if (error) return <p className="p-8">{error}</p>;
  if (!order) return <p className="p-8">Loading order...</p>;

  return (
    <section className="mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-bold">Track Your Order</h1>
      <p className="mt-4">Order: {order.order_token}</p>
      <p>Status: {order.status}</p>
      <p>Total: Rs. {Number(order.total).toLocaleString()}</p>
    </section>
  );
}
