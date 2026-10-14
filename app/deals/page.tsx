import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DealsContent from "@/components/DealsContent";

export default function DealsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />
      <DealsContent />
      <Footer />
    </main>
  );
}