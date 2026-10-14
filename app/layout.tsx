import type { Metadata } from "next";
import { CartProvider } from "./components/CartContext";
import { AuthProvider } from "../components/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "FoodieHub — Delicious Food Delivered Fast",
  description: "Order from top restaurants near you.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}