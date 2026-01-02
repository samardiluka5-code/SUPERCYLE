
import React from 'react';
import { Code, Terminal, Zap, Layers, Cpu, Database } from 'lucide-react';

export const ApiDocs: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="max-w-5xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <button onClick={onBack} className="mb-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-slate-950 transition-colors flex items-center gap-2">
        ← Return to Central Command
      </button>

      <div className="space-y-16">
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded text-[9px] font-black uppercase tracking-widest text-slate-500">
            <Terminal className="w-3 h-3" /> Core API v3.2-Stable
          </div>
          <h1 className="text-5xl font-black text-slate-950 tracking-tighter uppercase leading-none">
            Dermal <br/><span className="text-slate-300">Integration Gateway</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-2xl">
            Programmatic access to neural mapping engines and clinical regimen generation. Interface with the DermAI ecosystem via secure, low-latency RESTful protocols.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-12">
            <nav className="space-y-8">
              <div className="space-y-4">
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Authentication</span>
                <div className="flex flex-col gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <a href="#keys" className="text-slate-950">API Keys</a>
                  <a href="#oauth" className="hover:text-slate-950">OAuth 2.1</a>
                </div>
              </div>
              <div className="space-y-4">
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Endpoints</span>
                <div className="flex flex-col gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <a href="#analyze" className="hover:text-slate-950">POST /v3/analyze</a>
                  <a href="#history" className="hover:text-slate-950">GET /v3/history</a>
                  <a href="#regimen" className="hover:text-slate-950">POST /v3/regimen</a>
                </div>
              </div>
            </nav>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-slate-950" />
                <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest">Rate Limits</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide leading-relaxed">
                Standard Tier: 100 Req/min <br/>
                Institutional Tier: 10,000 Req/min
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-16">
            <section id="analyze" className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Code className="w-4 h-4 text-slate-950" />
                </div>
                <h3 className="text-xl font-black text-slate-950 uppercase tracking-tight">POST /v3/analyze</h3>
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Initiates a high-fidelity dermal analysis protocol. Requires a Base64 encoded image sample and authorized clinical credentials.
              </p>
              
              <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-2xl">
                <div className="px-6 py-3 bg-slate-900 border-b border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">JSON Request Body</span>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                </div>
                <pre className="p-8 text-[11px] mono text-slate-300 leading-relaxed overflow-x-auto">
{`{
  "source": "base64_encoded_dermal_sample",
  "protocol": "full_diagnostic",
  "metadata": {
    "node_id": "0x7F4A",
    "timestamp": "2024-03-20T14:30:00Z",
    "sovereign_id": "usr_9921"
  },
  "options": {
    "neural_depth": 0.95,
    "include_history": true
  }
}`}
                </pre>
              </div>
            </section>

            <section className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: Cpu, label: "GPU Acceleration", detail: "Powered by A100 Clusters" },
                  { icon: Database, label: "Persistence", detail: "Encrypted Vector DB" },
                  { icon: Layers, label: "Neural Layers", detail: "32-Layer Mapping" }
                ].map((item, i) => (
                  <div key={i} className="p-6 border border-slate-100 rounded-2xl space-y-3">
                    <item.icon className="w-5 h-5 text-slate-400" />
                    <h4 className="text-[10px] font-black text-slate-950 uppercase tracking-widest">{item.label}</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
