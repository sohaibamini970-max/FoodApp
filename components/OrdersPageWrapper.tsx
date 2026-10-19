"use client";

import { useParams } from "next/navigation";
import { Suspense } from "react";
import OrdersContent from "./OrdersContent";

export default function OrdersPageWrapper() {
  const params = useParams();
  const token = params?.token as string | undefined;

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-orange-500" />
        </div>
      }
    >
      {/* 👇 This now matches the updated signature in OrdersContent */}
      <OrdersContent initialToken={token} />
    </Suspense>
  );
}
