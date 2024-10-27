"use client";
import FooterBar from "@/components/ui/footerBar";
import Header from "@/components/ui/header";
import Sidebar from "@/components/ui/sidebar";
import { SessionProvider, useSession } from "next-auth/react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-100`}>
        <SessionProvider>
          <Header />
          <ProtectedLayout>{children}</ProtectedLayout>
        </SessionProvider>
      </body>
    </html>
  );
}

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>로딩 중...</p>;
  if (status === "unauthenticated")
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>로그인이 필요합니다. 로그인 후 이용해 주세요.</p>
      </div>
    );

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 ml-16">{children}</main>
        <FooterBar />
      </div>
    </div>
  );
}
