"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Database, Activity, ShieldAlert, FileText, Settings, Search, LogOut } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Directory CRUD', href: '/admin', icon: Database },
    { name: 'Vector Search Health', href: '/admin/search', icon: Search },
    { name: 'Analytics', href: '/admin/analytics', icon: Activity },
    { name: 'Audit Logs', href: '/admin/audit', icon: FileText },
    { name: 'RBAC Settings', href: '/admin/settings', icon: ShieldAlert },
  ];

  return (
    <aside className="w-full md:w-64 bg-[#0F172A] border-b md:border-b-0 md:border-r border-[#1E293B] flex flex-col shrink-0">
      <div className="h-16 flex items-center px-4 md:px-6 border-b border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#00A3E0] rounded flex items-center justify-center text-white font-bold tracking-tighter shadow-[0_0_10px_rgba(0,163,224,0.3)]">
            SLT
          </div>
          <span className="text-sm font-bold text-slate-100 leading-tight">Admin Console</span>
        </div>
      </div>

      <nav className="flex-none md:flex-1 overflow-x-auto md:overflow-y-auto flex md:flex-col py-3 md:py-6 px-4 space-x-2 md:space-x-0 md:space-y-1 scrollbar-hide">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-[#00A3E0]/10 text-[#00A3E0] border border-[#00A3E0]/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#00A3E0]' : 'text-slate-500'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="hidden md:block p-4 border-t border-[#1E293B]">
        <div className="flex items-center justify-between px-3 py-2 bg-[#1E293B] rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
              JS
            </div>
            <div className="text-xs">
              <p className="text-slate-200 font-semibold">J. Smith</p>
              <p className="text-slate-500">SysAdmin</p>
            </div>
          </div>
          <button className="text-slate-500 hover:text-rose-400 transition-colors" title="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
