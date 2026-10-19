"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import OrdersContent from "./OrdersContent";

// Inner component that reads the hook (this MUST be inside Suspense)
function TokenReader() {
  const params = useParams();
  const token = params?.token as string | undefined;
  return <OrdersContent initialToken={token} />;
}

// Outer wrapper provides the Suspense boundary
export default function OrdersPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-orange-500" />
        </div>
      }
    >
      <TokenReader />
    </Suspense>
  );
}
