import { Fraunces, Inter } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "The Roastery Co. | Specialty Coffee & Tea",
  description:
    "Specialty coffee, a proper South Asian tea program, and small-batch bakery. Islamabad.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-screen">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}