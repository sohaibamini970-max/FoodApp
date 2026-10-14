import Header from "../components/Header";
import Footer from "../components/Footer";
import HowContent from "../components/HowContent";

export default function HowPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />
      <HowContent />
      <Footer />
    </main>
  );
}