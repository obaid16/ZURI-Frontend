import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "ZURI ENTERPRISES | Premium B2B Wholesale Cap & Textile Sourcing",
  description: "Luxury B2B manufacturer and wholesale supplier of structured cotton buckram, adjusters, blank snapbacks, dad hats, and bespoke cap manufacturing services.",
  keywords: "custom caps, cap wholesale, cotton buckram, cap accessories, fabric supplier, snapback blanks, dad hat manufacturer",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-navy-dark text-white flex flex-col font-sans">
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}

