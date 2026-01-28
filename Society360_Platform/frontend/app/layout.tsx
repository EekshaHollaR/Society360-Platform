import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Society360 Platform | Modern Society Management",
  description: "Comprehensive management solution for modern residential societies. Streamline visitors, finances, and communication.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased selection:bg-primary-light selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
