import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-3.5rem)] w-full bg-[#0F172A] text-slate-200 overflow-y-auto md:overflow-hidden font-sans">
      <main className="flex-1 flex flex-col min-w-0 md:overflow-hidden">
        {children}
      </main>
    </div>
  );
}
