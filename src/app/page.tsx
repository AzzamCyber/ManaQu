'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/actions/auth';
import { Package, ArrowRight, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Authentication Failed!');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px', opacity: 0.1 }}></div>

      <div className="w-full max-w-[380px] relative z-10 animate-bounce-in">
        
        {/* Main Card */}
        <div className="bg-[#f472b6] border-2 border-black shadow-[6px_6px_0_0_#000] p-1 mb-6">
          <div className="bg-white border-2 border-black p-5 relative">
            
            {/* Header/Logo */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-12 h-12 bg-[#34d399] border-2 border-black shadow-[2px_2px_0_0_#000] flex items-center justify-center mb-3 transform -rotate-3 hover:rotate-0 transition-transform">
                <Package className="w-6 h-6 text-black" strokeWidth={2.5} />
              </div>
              <h1 className="text-2xl font-black text-black tracking-tighter uppercase font-mono bg-[#fef08a] px-2 py-0.5 border-2 border-black transform rotate-1">
                ManaQu
              </h1>
              <p className="mt-3 text-xs font-bold text-black border-b-2 border-black pb-0.5 uppercase tracking-widest">
                System Access
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 bg-[#fca5a5] border-2 border-black shadow-[2px_2px_0_0_#000] flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-black" />
                <p className="text-xs font-bold text-black uppercase">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-bold text-black uppercase" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  defaultValue="admin@azzam.com"
                  className="w-full px-3 py-2 text-sm bg-[#e0f2fe] border-2 border-black text-black font-bold focus:outline-none focus:bg-[#bae6fd] focus:shadow-[2px_2px_0_0_#000] transition-all"
                  placeholder="ENTER EMAIL"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-bold text-black uppercase" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  defaultValue="azzam108"
                  className="w-full px-3 py-2 text-sm bg-[#fef08a] border-2 border-black text-black font-bold focus:outline-none focus:bg-[#fde047] focus:shadow-[2px_2px_0_0_#000] transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-4 bg-[#60a5fa] hover:bg-[#3b82f6] text-black font-black text-sm uppercase border-2 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    'PROCESSING...'
                  ) : (
                    <>
                      <span>LOGIN NOW</span>
                      <ArrowRight className="w-4 h-4" strokeWidth={3} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer info box */}
        <div className="bg-[#a78bfa] border-2 border-black p-2 shadow-[3px_3px_0_0_#000] transform rotate-1 text-center">
          <p className="text-black font-bold uppercase text-[10px]">
            Demo credentials autofilled. Ready to smash!
          </p>
        </div>

      </div>
    </div>
  );
}
