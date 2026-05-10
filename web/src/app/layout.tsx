import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import StyledJsxRegistry from "./registry";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UniSimplify | Universal Indian College Applications",
  description: "Apply to multiple Indian universities with a single profile. Fill once, apply everywhere.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={inter.className}>
        <StyledJsxRegistry>
          <div className="grid-bg" />
          <div className="radial-glow" aria-hidden />
          <Navbar />
          <main style={{ paddingTop: '100px' }}>
            {children}
          </main>
        </StyledJsxRegistry>
      </body>
    </html>
  );
}
