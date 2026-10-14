import Header from "../components/Header";
import Footer from "../components/Footer";
import MenuContent from "../components/MenuContent";

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />
      <MenuContent />
      <Footer />
    </main>
  );
}