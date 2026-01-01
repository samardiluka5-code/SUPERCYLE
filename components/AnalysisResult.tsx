
import React from 'react';
import { SkinAnalysisResult, User } from '../types';
import { 
  Check, 
  ExternalLink, 
  Info, 
  Lock, 
  ShoppingBag, 
  Sun, 
  Moon, 
  Droplet, 
  Shield, 
  Target, 
  Zap,
  Activity,
  Heart
} from 'lucide-react';

interface ResultProps {
  result: SkinAnalysisResult;
  user: User | null;
  onReset: () => void;
  onUpgrade: () => void;
}

export const AnalysisResult: React.FC<ResultProps> = ({ result, user, onReset, onUpgrade }) => {
  const isPremium = user?.plan === 'PREMIUM';

  const morningRoutine = result?.recommendations?.routine?.morning || [];
  const eveningRoutine = result?.recommendations?.routine?.evening || [];
  const products = result?.recommendations?.products || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Overview Block - Matches Screenshot Header Area */}
      <div className="bg-white border border-slate-200 rounded-3xl p-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2">
              <div className="bg-slate-900 p-1.5 rounded-lg">
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diagnostic Summary</span>
            </div>
            <p className="text-slate-600 text-lg font-medium leading-relaxed">
              {result.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:max-w-xs">
            {result.concerns.map((concern, i) => (
              <span key={i} className="px-4 py-2 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] border border-slate-100">
                {concern}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bio-Scores Section - Replicated from User Screenshot */}
      <div className="bg-white border-2 border-blue-400 rounded-3xl overflow-hidden shadow-xl shadow-blue-50/50">
        <div className="divide-y divide-slate-100">
          {/* Hydration Score */}
          <div className="p-10 flex items-center justify-between group">
            <div className="flex-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Hydration Bio-Factor</p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-slate-900 tracking-tighter">
                  {isPremium ? result.hydrationLevel : '??'}
                </span>
                <span className="text-lg font-bold text-slate-400">%</span>
              </div>
              <div className="mt-6 w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                  style={{ width: isPremium ? `${result.hydrationLevel}%` : '4.5%' }} 
                />
              </div>
            </div>
            <div className="pl-10">
              <Droplet className="w-16 h-16 text-slate-50 group-hover:text-blue-50 transition-colors" />
            </div>
          </div>

          {/* Sensitivity Score */}
          <div className="p-10 flex items-center justify-between group">
            <div className="flex-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Sensitivity Index</p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-slate-900 tracking-tighter">
                  {isPremium ? result.sensitivityScore : '??'}
                </span>
                <span className="text-lg font-bold text-slate-400">%</span>
              </div>
              <div className="mt-6 w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-500 rounded-full transition-all duration-1000" 
                  style={{ width: isPremium ? `${result.sensitivityScore}%` : '8.5%' }} 
                />
              </div>
            </div>
            <div className="pl-10">
              <Shield className="w-16 h-16 text-slate-50 group-hover:text-rose-50 transition-colors" />
            </div>
          </div>
        </div>

        {!isPremium && (
          <div className="bg-blue-50/50 p-6 flex items-center justify-center gap-4">
            <Lock className="w-4 h-4 text-blue-400" />
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Premium Diagnostics Locked</p>
            <button 
              onClick={onUpgrade}
              className="px-6 py-2 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg hover:bg-blue-600 transition-all"
            >
              Reveal Scores
            </button>
          </div>
        )}
      </div>

      {/* Additional Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 flex items-center gap-6 relative overflow-hidden group">
          {!isPremium && <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm" />}
          <div className="bg-emerald-50 p-4 rounded-2xl">
            <Heart className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Vitality Score</p>
            <p className="text-3xl font-black text-slate-900">{isPremium ? result.healthScore : '--'}<span className="text-sm font-medium text-slate-400 ml-1">PT</span></p>
          </div>
          <div className="ml-auto opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-20 h-20 text-slate-900" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 flex items-center gap-6 relative overflow-hidden group">
          {!isPremium && <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm" />}
          <div className="bg-amber-50 p-4 rounded-2xl">
            <Zap className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Biological Age Index</p>
            <p className="text-3xl font-black text-slate-900">{isPremium ? result.ageIndex : '--'}<span className="text-sm font-medium text-slate-400 ml-1">YR</span></p>
          </div>
          <div className="ml-auto opacity-10 group-hover:opacity-20 transition-opacity">
            <Target className="w-20 h-20 text-slate-900" />
          </div>
        </div>
      </div>

      {/* Routine Protocol Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm">
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-amber-50 p-4 rounded-2xl">
              <Sun className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">AM Protocol</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phase 01: Protect & Activate</p>
            </div>
          </div>
          <div className="space-y-4">
            {morningRoutine.map((step, i) => (
              <div key={i} className="flex gap-4 items-start p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                <div className="bg-white w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border border-slate-200 text-[10px] font-black text-slate-400">0{i+1}</div>
                <p className="text-sm text-slate-600 font-semibold leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm">
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-indigo-50 p-4 rounded-2xl">
              <Moon className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">PM Protocol</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phase 02: Repair & Recover</p>
            </div>
          </div>
          <div className="space-y-4">
            {eveningRoutine.map((step, i) => (
              <div key={i} className="flex gap-4 items-start p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                <div className="bg-white w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border border-slate-200 text-[10px] font-black text-slate-400">0{i+1}</div>
                <p className="text-sm text-slate-600 font-semibold leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Product Recommendations */}
      <div className="relative">
        {!isPremium && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-slate-950/20 backdrop-blur-sm border border-slate-200">
            <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 max-w-sm text-center">
              <ShoppingBag className="w-12 h-12 text-slate-900 mx-auto mb-6" />
              <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Clinical Apothecary</h4>
              <p className="text-sm text-slate-500 mb-8 font-medium">Unlock product formulations engineered for your unique dermal bio-profile.</p>
              <button onClick={onUpgrade} className="w-full py-4 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-800 shadow-xl">Enable Premium Access</button>
            </div>
          </div>
        )}
        
        <div className="bg-slate-950 rounded-[3rem] p-12 overflow-hidden relative shadow-2xl">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/20 p-3 rounded-2xl">
                <Target className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Curated Clinical Stock</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Selected via Neuralregimen Matching</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all group flex flex-col h-full">
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block mb-4 border-b border-white/5 pb-3">{p.category}</span>
                <h4 className="text-white font-bold text-xl mb-3 group-hover:text-emerald-400 transition-colors">{p.name}</h4>
                <p className="text-slate-400 text-xs font-medium leading-relaxed mb-10 flex-grow">{p.reason}</p>
                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{p.priceRange}</span>
                  <a href={p.link} target="_blank" className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:translate-x-1 transition-transform group-hover:underline underline-offset-8">
                    Acquire Now <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Safety Footer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-slate-50 rounded-2xl p-6 flex items-start gap-4 border border-slate-100">
          <Info className="w-5 h-5 text-slate-400 shrink-0" />
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Clinical Disclaimer</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed tracking-wider">
              {result.disclaimer}
            </p>
          </div>
        </div>
        <div className="lg:col-span-4">
          <button onClick={onReset} className="w-full h-full py-6 bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
            Reset Diagnostic Module
          </button>
        </div>
      </div>
    </div>
  );
};
