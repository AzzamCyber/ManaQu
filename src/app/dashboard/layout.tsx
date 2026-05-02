import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { SidebarProvider } from "@/components/SidebarProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-[#f8fafc] text-black w-full overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 md:p-8 relative z-0 flex flex-col">
            <div className="flex-1 max-w-[1600px] mx-auto w-full">
              {children}
            </div>
            
            {/* Global Footer */}
            <footer className="mt-12 pt-6 pb-2 border-t-2 border-black flex flex-col sm:flex-row justify-between items-center gap-4 max-w-[1600px] mx-auto w-full">
              <div className="bg-[#fef08a] border-2 border-black px-3 py-1 shadow-[2px_2px_0_0_#000]">
                <span className="font-black text-black uppercase text-xs tracking-widest">Code By Azzam Codex</span>
              </div>
              <div className="text-xs font-bold uppercase text-black">
                &copy; {new Date().getFullYear()} ManaQu WMS
              </div>
            </footer>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
