
import React from 'react';
import { Activity, Shield } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate?: (view: 'APP' | 'COMPLIANCE' | 'API_DOCS') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafbfc]">
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div onClick={() => onNavigate?.('APP')} className="flex items-center gap-4 group cursor-pointer">
            <div className="bg-slate-900 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-500">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-950 uppercase leading-none">
                DERMAI
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">
                Clinical Precision
              </span>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden lg:flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Secure Data Systems
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-8 py-16">
        {children}
      </main>

      <footer className="border-t border-slate-100 py-16 bg-white">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-4 max-w-xs">
            <span className="text-sm font-black text-slate-950 uppercase tracking-widest">DermAI Professional</span>
            <p className="text-slate-400 text-xs font-medium leading-relaxed">
              Providing professional skin analysis through high-fidelity computer vision and neural architectural mapping.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-16 gap-y-8">
            <div className="space-y-4">
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Information</span>
              <div className="flex flex-col gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <button onClick={() => onNavigate?.('COMPLIANCE')} className="text-left hover:text-slate-950 transition-colors uppercase">Compliance & Ethics</button>
                <button className="text-left hover:text-slate-950 transition-colors uppercase">Privacy Policy</button>
              </div>
            </div>
            <div className="space-y-4">
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Resources</span>
              <div className="flex flex-col gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <button onClick={() => onNavigate?.('API_DOCS')} className="text-left hover:text-slate-950 transition-colors uppercase">Developer API</button>
                <button className="text-left hover:text-slate-950 transition-colors uppercase">Whitepaper</button>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 mt-16 pt-8 border-t border-slate-50 flex justify-between items-center">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} DermAI. All Rights Reserved.
          </p>
          <div className="flex gap-4">
            <Shield className="w-4 h-4 text-slate-200" />
          </div>
        </div>
      </footer>
    </div>
  );
};
