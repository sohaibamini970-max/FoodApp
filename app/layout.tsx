// import type { Metadata } from "next";
// import { CartProvider } from "../components/CartContext";
// import { AuthProvider } from "@/components/AuthContext";
// import { OrdersProvider } from "@/components/OrdersContext";
// import "./globals.css";

// export const metadata: Metadata = {
//   title: "FoodieHub — Delicious Food Delivered Fast",
//   description: "Order from top restaurants near you.",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" data-scroll-behavior="smooth">
//       <body>
//         <AuthProvider>
//           <OrdersProvider>
//             <CartProvider>{children}</CartProvider>
//           </OrdersProvider>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }
import { Suspense } from "react";
// ...other imports unchanged
import type { Metadata } from "next";
import { CartProvider } from "../components/CartContext";
import { AuthProvider } from "@/components/AuthContext";
import { OrdersProvider } from "@/components/OrdersContext";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <AuthProvider>
          <OrdersProvider>
            <CartProvider>
              <Suspense fallback={null}>{children}</Suspense>
            </CartProvider>
          </OrdersProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
