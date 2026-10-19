import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderTrackingContent from "@/components/OrderTrackingContent"; // or whatever component renders the details

export default function OrderTrackingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />
      <Suspense fallback={<div className="flex h-[60vh] items-center justify-center text-white">Loading order...</div>}>
        <OrderTrackingContent />
      </Suspense>
      <Footer />
    </main>
  );
}
