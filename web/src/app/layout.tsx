import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Whop Video Analytics Submissions",
  description: "Submit short video + analytics side-by-side",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0b0e11] text-white`}
      >
        <div className="min-h-screen">
          <header className="sticky top-0 z-10 backdrop-blur-xl bg-black/20 border-b border-white/10">
            <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
              <h1 className="font-semibold tracking-tight text-orange-300">Whop Analytics</h1>
              <nav className="text-sm text-white/70">Submit • Submissions • Admin</nav>
            </div>
          </header>
          <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
