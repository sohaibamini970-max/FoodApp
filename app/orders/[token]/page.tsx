import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrdersContent from "@/components/OrdersContent";

export const dynamic = 'force-dynamic'; 

export const metadata = { title: "My Orders — FoodieHub" };

export default function OrdersPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />
      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center">
            <span className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-orange-500" />
          </div>
        }
      >
        <OrdersContent />
      </Suspense>
      <Footer />
    </main>
  );
}
