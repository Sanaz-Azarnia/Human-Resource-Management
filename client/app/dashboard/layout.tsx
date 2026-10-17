import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import React from "react";

export default function DashboardLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

       
      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar />

        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>

      <Footer />
    </div>

  )
}