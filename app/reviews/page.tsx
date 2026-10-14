import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReviewsContent from "@/components/ReviewsContent";

export default function ReviewsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />
      <ReviewsContent />
      <Footer />
    </main>
  );
}