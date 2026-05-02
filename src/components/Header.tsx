'use client';

import { useSidebar } from './SidebarProvider';
import { Menu, Zap } from 'lucide-react';

export default function Header() {
  const { toggle } = useSidebar();

  return (
    <header className="h-16 bg-white border-b-2 border-black flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center">
        {/* Mobile menu button */}
        <button 
          onClick={toggle}
          className="md:hidden mr-4 text-black bg-[#fef08a] border-2 border-black p-1.5 hover:bg-[#fde047] hover:shadow-[2px_2px_0_0_#000] transition-all"
        >
          <Menu className="w-5 h-5" strokeWidth={2.5} />
        </button>
        <h2 className="text-2xl font-black text-black tracking-tight md:hidden">
          MANAQU
        </h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <span className="hidden sm:inline-flex items-center gap-1.5 font-black text-black bg-[#60a5fa] border-2 border-black py-1 px-3 uppercase text-[10px] tracking-widest shadow-[2px_2px_0_0_#000]">
          <Zap className="w-3 h-3 fill-black" strokeWidth={2} />
          REFINED EDITION
        </span>
        <div className="h-9 w-9 bg-[#f472b6] border-2 border-black flex items-center justify-center text-black font-black text-sm shadow-[2px_2px_0_0_#000] cursor-pointer hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
          AC
        </div>
      </div>
    </header>
  );
}
