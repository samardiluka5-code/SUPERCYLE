
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
  Heart,
  Award
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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Overview Block */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6 flex-1">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 p-2 rounded-xl">
                <Activity className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Diagnostic Summary</span>
            </div>
            <p className="text-slate-600 text-xl font-medium leading-relaxed max-w-3xl">
              {result.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:max-w-[280px] pt-2">
            {result.concerns.map((concern, i) => (
              <span key={i} className="px-5 py-2.5 bg-slate-50 text-slate-500 rounded-2xl text-[10px] font-bold uppercase tracking-[0.15em] border border-slate-100 transition-all hover:bg-slate-100">
                {concern}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bio-Scores Section - Replicated from Screenshot */}
      <div className="bg-white border-2 border-blue-400 rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-400/5">
        <div className="divide-y divide-slate-50">
          {/* Hydration Score */}
          <div className="p-12 md:p-16 flex items-center justify-between group">
            <div className="flex-1">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-6">Hydration Bio-Factor</p>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-black text-slate-900 tracking-tighter">
                  {isPremium ? result.hydrationLevel : '4.5'}
                </span>
                <span className="text-2xl font-bold text-slate-400">%</span>
              </div>
              <div className="mt-8 w-full h-2 bg-slate-50 rounded-full overflow-hidden max-w-md">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: isPremium ? `${result.hydrationLevel}%` : '4.5%' }} 
                />
              </div>
            </div>
            <div className="hidden sm:block pl-10">
              <Droplet className="w-24 h-24 text-slate-50 group-hover:text-blue-50/50 transition-colors" />
            </div>
          </div>

          {/* Sensitivity Score */}
          <div className="p-12 md:p-16 flex items-center justify-between group">
            <div className="flex-1">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-6">Sensitivity Index</p>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-black text-slate-900 tracking-tighter">
                  {isPremium ? result.sensitivityScore : '8.5'}
                </span>
                <span className="text-2xl font-bold text-slate-400">%</span>
              </div>
              <div className="mt-8 w-full h-2 bg-slate-50 rounded-full overflow-hidden max-w-md">
                <div 
                  className="h-full bg-rose-500 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: isPremium ? `${result.sensitivityScore}%` : '8.5%' }} 
                />
              </div>
            </div>
            <div className="hidden sm:block pl-10">
              <Shield className="w-24 h-24 text-slate-50 group-hover:text-rose-50/50 transition-colors" />
            </div>
          </div>
        </div>

        {!isPremium && (
          <div className="bg-slate-50 p-8 flex flex-col sm:flex-row items-center justify-center gap-6 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-slate-400" />
              <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">Clinical Bio-Metrics Restricted</p>
            </div>
            <button 
              onClick={onUpgrade}
              className="px-10 py-3.5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl hover:bg-slate-800 transition-all active:scale-95"
            >
              Unlock Authorized Scores
            </button>
          </div>
        )}
      </div>

      {/* Health Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 flex flex-col justify-between group hover:border-emerald-200 transition-all">
          <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
            <Heart className="w-7 h-7 text-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Vitality Score</p>
            <p className="text-4xl font-black text-slate-900">{isPremium ? result.healthScore : '--'}<span className="text-base font-bold text-slate-300 ml-1">PT</span></p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 flex flex-col justify-between group hover:border-amber-200 transition-all">
          <div className="bg-amber-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
            <Target className="w-7 h-7 text-amber-500" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bio-Age Index</p>
            <p className="text-4xl font-black text-slate-900">{isPremium ? result.ageIndex : '--'}<span className="text-base font-bold text-slate-300 ml-1">YR</span></p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 flex flex-col justify-between group hover:border-indigo-200 transition-all">
          <div className="bg-indigo-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
            <Award className="w-7 h-7 text-indigo-500" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dermal Grade</p>
            <p className="text-4xl font-black text-slate-900">{isPremium ? 'A+' : '--'}</p>
          </div>
        </div>
      </div>

      {/* Routine Protocol Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-12 shadow-sm group">
          <div className="flex items-center gap-5 mb-12">
            <div className="bg-amber-50 p-5 rounded-[1.5rem] group-hover:bg-amber-100 transition-colors">
              <Sun className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">AM Protocol</h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Phase 01: Active Protection</p>
            </div>
          </div>
          <div className="space-y-5">
            {morningRoutine.map((step, i) => (
              <div key={i} className="flex gap-5 items-start p-6 bg-slate-50/40 rounded-[1.5rem] border border-slate-100 hover:border-amber-100 hover:bg-white transition-all">
                <div className="bg-white w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-slate-200 text-[11px] font-black text-slate-400">0{i+1}</div>
                <p className="text-[15px] text-slate-600 font-semibold leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-12 shadow-sm group">
          <div className="flex items-center gap-5 mb-12">
            <div className="bg-indigo-50 p-5 rounded-[1.5rem] group-hover:bg-indigo-100 transition-colors">
              <Moon className="w-8 h-8 text-indigo-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">PM Protocol</h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Phase 02: Dermal Repair</p>
            </div>
          </div>
          <div className="space-y-5">
            {eveningRoutine.map((step, i) => (
              <div key={i} className="flex gap-5 items-start p-6 bg-slate-50/40 rounded-[1.5rem] border border-slate-100 hover:border-indigo-100 hover:bg-white transition-all">
                <div className="bg-white w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-slate-200 text-[11px] font-black text-slate-400">0{i+1}</div>
                <p className="text-[15px] text-slate-600 font-semibold leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Safety & Action Footer */}
      <div className="flex flex-col lg:flex-row gap-6 pt-10">
        <div className="flex-1 bg-slate-900 rounded-[2rem] p-8 flex items-start gap-5 border border-slate-800 shadow-2xl">
          <Info className="w-6 h-6 text-slate-500 shrink-0 mt-1" />
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical Protocol Notice</p>
            <p className="text-[11px] font-medium text-slate-300 leading-relaxed tracking-wide opacity-80">
              {result.disclaimer}
            </p>
          </div>
        </div>
        <button 
          onClick={onReset} 
          className="lg:w-80 py-8 bg-white border-2 border-slate-900 text-slate-900 font-black text-[12px] uppercase tracking-[0.4em] rounded-[2rem] hover:bg-slate-900 hover:text-white transition-all shadow-xl active:scale-[0.98]"
        >
          Initialize New Session
        </button>
      </div>
    </div>
  );
};
