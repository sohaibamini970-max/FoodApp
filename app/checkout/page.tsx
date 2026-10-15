import Header from "../components/Header";
import Footer from "../components/Footer";
import CheckoutContent from "../components/CheckoutContent";

export const metadata = { title: "Checkout — FoodieHub" };

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />
      <CheckoutContent />
      <Footer />
    </main>
  );
}