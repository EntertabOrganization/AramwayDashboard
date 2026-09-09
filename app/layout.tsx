import type { Metadata } from "next";
import { Ubuntu_Sans, Montserrat } from "next/font/google";
import "./globals.css";

const ubuntuSans = Ubuntu_Sans({
  subsets: ["latin"],
  variable: "--font-ubuntu-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Aramway Admin Dashboard",
    template: "%s | Aramway Admin",
  },
  description: "Internal admin dashboard for managing Aramway site content (mock data).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ubuntuSans.variable} ${montserrat.variable} antialiased`}>{children}</body>
    </html>
  );
}
