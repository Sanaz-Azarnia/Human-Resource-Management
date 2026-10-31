"use client";

import { useState } from 'react';
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import { PanelLeft } from 'lucide-react';
import React from "react";

export default function DashboardLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* هدر موبایل داشبورد - فقط در موبایل */}
      <div className="md:hidden sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 py-3">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-slate-200 text-indigo-600 hover:bg-slate-50 hover:text-indigo-700 transition-all active:scale-95 shadow-sm"
          aria-label="Open sidebar"
        >
          <PanelLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-semibold text-slate-900">
          Dashboard
        </span>
      </div>

      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}