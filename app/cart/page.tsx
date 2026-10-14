import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartContent from "@/components/CartContent";

export default function CartPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />
      <CartContent />
      <Footer />
    </main>
  );
}