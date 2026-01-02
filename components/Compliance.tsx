
import React from 'react';
import { ShieldCheck, FileText, Globe, Gavel, Scale, Lock } from 'lucide-react';

export const Compliance: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <button onClick={onBack} className="mb-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-slate-950 transition-colors flex items-center gap-2">
        ← Return to Central Command
      </button>

      <div className="space-y-16">
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded text-[9px] font-black uppercase tracking-widest text-slate-500">
            <Gavel className="w-3 h-3" /> Regulatory Framework 2.4.0
          </div>
          <h1 className="text-5xl font-black text-slate-950 tracking-tighter uppercase leading-none">
            Institutional <br/><span className="text-slate-300">Compliance & Sovereignty</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-2xl">
            Our governance model is predicated on the fundamental principle of Dermal Autonomy. We adhere to the highest mandates of biosecurity and algorithmic accountability.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-950 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">Sovereign Data Rights</h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              We operate under the <span className="text-slate-950 font-bold">Bio-Digital Integrity Act</span>. Every dermal scan is encrypted via quantum-resistant protocols, ensuring your biological information remains your absolute sovereign property. No central authority is granted access without multi-signature cryptographic authorization.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-950 rounded-xl">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">Algorithmic Accountability</h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Our neural architectures are audited bi-annually for systemic bias and diagnostic equity. We mandate a "Clear-Box" policy where every clinical recommendation must be traceable to a specific, verified dermatological consensus, preventing arbitrary regimen mandates.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-950 rounded-xl">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">Dermal Privacy Mandate</h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Privacy is not a choice; it is an institutional requirement. The <span className="text-slate-950 font-bold">Cutaneous Protection Protocol</span> ensures that all diagnostic artifacts are purged from edge-nodes within 180 seconds of session termination, unless designated for long-term longitudinal persistence by the sovereign user.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-950 rounded-xl">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">Transcontinental Compliance</h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              DermAI maintains parity with GDPR, HIPAA, and the emerging <span className="text-slate-950 font-bold">Global Bio-Governance Accord</span>. Our systems dynamically adjust processing heuristics to satisfy the unique legislative mandates of over 140 jurisdictions.
            </p>
          </section>
        </div>

        <div className="p-10 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row items-center gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <FileText className="w-10 h-10 text-slate-300" />
          </div>
          <div className="flex-1 space-y-2">
            <h4 className="text-sm font-black text-slate-950 uppercase tracking-widest">Ethics Committee Charter</h4>
            <p className="text-xs text-slate-400 font-bold leading-relaxed uppercase tracking-wide">
              All diagnostic logic is subject to the review of the DermAI Independent Ethics Board. We prioritize human clinical safety over algorithmic efficiency.
            </p>
          </div>
          <button className="px-8 py-3 bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-slate-800 transition-all">
            Download Charter PDF
          </button>
        </div>
      </div>
    </div>
  );
};
