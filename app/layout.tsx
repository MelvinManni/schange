import type { Metadata } from "next";
import { Lato, Red_Hat_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/header";

const redHatDisplay = Red_Hat_Display({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-red-hat-display",
  style: ["normal", "italic"],
  display: "swap",
});
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Schange",
  description: "",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${redHatDisplay.variable} ${lato.variable} font-body`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
