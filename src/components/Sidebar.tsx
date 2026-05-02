'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from './SidebarProvider';
import { logout } from '@/actions/auth';
import { LayoutDashboard, Package, FileText, LogOut, X, Box, ArrowRightLeft, ArrowDownToLine, ArrowUpFromLine, Warehouse } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

type NavSection = {
  title: string;
  links: { name: string; href: string; icon: any; color: string }[];
};

export default function Sidebar() {
  const { isOpen, setIsOpen } = useSidebar();
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLAnchorElement[]>([]);

  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      gsap.fromTo(linksRef.current, 
        { x: -50, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(1.5)', clearProps: 'all' }
      );
    }
  }, [isOpen]);

  const addToLinksRef = (el: HTMLAnchorElement | null) => {
    if (el && !linksRef.current.includes(el)) {
      linksRef.current.push(el);
    }
  };

  const navSections: NavSection[] = [
    {
      title: 'Utama',
      links: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, color: 'bg-[#60a5fa]' },
        { name: 'Data Barang', href: '/dashboard/barang', icon: Package, color: 'bg-[#f472b6]' },
      ],
    },
    {
      title: 'Transaksi',
      links: [
        { name: 'Barang Masuk', href: '/dashboard/inbound', icon: ArrowDownToLine, color: 'bg-[#34d399]' },
        { name: 'Barang Keluar', href: '/dashboard/outbound', icon: ArrowUpFromLine, color: 'bg-[#f87171]' },
        { name: 'Riwayat Transaksi', href: '/dashboard/transaksi', icon: ArrowRightLeft, color: 'bg-[#fbbf24]' },
      ],
    },
    {
      title: 'Management',
      links: [
        { name: 'Lokasi Gudang', href: '/dashboard/gudang', icon: Warehouse, color: 'bg-[#a78bfa]' },
        { name: 'Laporan', href: '/dashboard/laporan', icon: FileText, color: 'bg-[#fbbf24]' },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside 
        ref={sidebarRef}
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white text-black flex-shrink-0 flex flex-col transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} border-r-2 border-black`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b-2 border-black bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black flex items-center justify-center">
              <Box className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-black text-2xl uppercase tracking-tighter">ManaQu</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-black hover:bg-[#fca5a5] border-2 border-transparent hover:border-black p-1 transition-all">
            <X className="w-5 h-5" strokeWidth={3} />
          </button>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          {navSections.map((section, idx) => (
            <div key={section.title} className={idx !== 0 ? "mt-8" : ""}>
              <p className="px-3 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">{section.title}</p>
              <nav className="space-y-1.5">
                {section.links.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link 
                      key={link.name}
                      href={link.href} 
                      ref={addToLinksRef}
                      className={`flex items-center px-3 py-3 text-sm font-black uppercase transition-all duration-200 border-2 ${
                        isActive 
                        ? `${link.color} border-black shadow-[4px_4px_0_0_#000] translate-x-1` 
                        : 'border-transparent hover:bg-gray-100 hover:border-black'
                      }`}
                      onClick={() => window.innerWidth < 768 && setIsOpen(false)}
                    >
                      <Icon className="w-5 h-5 mr-3 text-black" strokeWidth={2.5} />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
        
        {/* Footer Area */}
        <div className="p-4 border-t-2 border-black bg-white">
          <form action={logout}>
            <button type="submit" className="flex items-center justify-center w-full px-4 py-3 text-sm font-black uppercase text-black bg-white hover:bg-[#fca5a5] border-2 border-black transition-all duration-200 shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000]">
              <LogOut className="w-4 h-4 mr-2" strokeWidth={3} />
              Logout
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
