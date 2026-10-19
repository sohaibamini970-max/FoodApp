import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrdersPageWrapper from "@/components/OrdersPageWrapper";

export const metadata = { title: "Track Order — FoodieHub" };

export default function OrderTrackingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />
      <OrdersPageWrapper />
      <Footer />
    </main>
  );
}
