import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AuthMenu from "@/components/AuthMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProofReel - Verifiable Win Tracker for Whop",
  description: "Create challenges, track video performance, and verify wins with side-by-side analytics review.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen">
          <header className="sticky top-0 z-10 backdrop-blur-xl bg-black/20 border-b border-white/10">
            <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
              <Link href="/" className="font-bold text-2xl text-white">
                ProofReel
              </Link>
              <nav className="flex items-center gap-4">
                <Link href="/submit">
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    Submit
                  </Button>
                </Link>
                <Link href="/my-submissions">
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    My Submissions
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/gallery">
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    Gallery
                  </Button>
                </Link>
                <AuthMenu />
              </nav>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
