import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderTrackingContent from "@/components/OrderTrackingContent";

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />
      <OrderTrackingContent token={token} />
      <Footer />
    </main>
  );
}
