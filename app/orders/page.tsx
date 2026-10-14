import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrdersContent from "@/components/OrdersContent";

export const metadata = { title: "My Orders — FoodieHub" };

export default function OrdersPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />
      <OrdersContent />
      <Footer />
    </main>
  );
}