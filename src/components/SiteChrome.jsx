"use client";

import { usePathname } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import ChatWidget from "@/components/chat/ChatWidget";

export default function SiteChrome({ children }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return children;
  }

  return (
    <CartProvider>
      <Nav />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
      <ChatWidget />
    </CartProvider>
  );
}