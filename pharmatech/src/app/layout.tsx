import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { createClient } from "@/lib/supabase/server";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PharmaTech - Gələcəyin Apteki",
  description:
    "Süni intellekt və peşəkar tibbin birləşdiyi nöqtə. Sizin şəxsi rəqəmsal aptekiniz.",
  openGraph: {
    title: "PharmaTech - Gələcəyin Apteki",
    description: "AI destekli rəqəmsal aptek platforması",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  let user = null;
  if (supabase) {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  return (
    <html lang="az">
      <body
        className={`${inter.variable} font-sans text-slate-600 overflow-x-hidden antialiased`}
      >
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-400/10 blur-[100px] rounded-full" />
        </div>

        <Navbar user={user ? { email: user.email || "" } : null} />
        {children}
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
