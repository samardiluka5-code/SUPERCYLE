
import React from 'react';
import { SkinAnalysisResult, User } from '../types';
import { DermalMetricsChart } from './DermalMetricsChart';
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
  Award,
  TrendingUp
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

  const metrics = [
    { label: 'Hydration', value: result.hydrationLevel },
    { label: 'Resilience', value: 100 - result.sensitivityScore },
    { label: 'Vitality', value: result.healthScore },
    { label: 'Clarity', value: 85 }, // Simulated
    { label: 'Texture', value: 100 - result.ageIndex },
  ];

  const baselineMetrics = [
    { label: 'Hydration', value: 45 },
    { label: 'Resilience', value: 60 },
    { label: 'Vitality', value: 55 },
    { label: 'Clarity', value: 70 },
    { label: 'Texture', value: 50 },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
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

      {/* Analytical Matrix - Radar Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-[3rem] p-12 shadow-sm flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden group">
          <div className="absolute top-10 left-10 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-slate-950" />
            <h3 className="text-lg font-black text-slate-950 uppercase tracking-tighter">Dermal Morphometry</h3>
          </div>
          
          <DermalMetricsChart 
            current={metrics} 
            baseline={baselineMetrics} 
            isPremium={isPremium} 
          />

          {!isPremium && (
            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-white via-white/95 to-transparent flex flex-col items-center pt-24 text-center">
              <Lock className="w-6 h-6 text-slate-400 mb-4" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Historical comparison restricted</p>
              <button onClick={onUpgrade} className="px-8 py-3 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full">Unlock Longitudinal View</button>
            </div>
          )}
        </div>

        {/* Score Cards Side */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-950 rounded-[2.5rem] p-10 text-white flex flex-col justify-between h-full group hover:shadow-2xl hover:shadow-slate-200 transition-all">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hydration Bio-Factor</span>
                <Droplet className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-black tracking-tighter">{isPremium ? result.hydrationLevel : '??'}</span>
                <span className="text-2xl font-bold text-slate-600">%</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-1000" 
                  style={{ width: isPremium ? `${result.hydrationLevel}%` : '45%' }} 
                />
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-12 group-hover:text-slate-300 transition-colors">
              Intracellular fluid density optimized for dermal barrier stability.
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 flex flex-col justify-between group hover:border-rose-100 transition-all">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sensitivity Index</span>
                <Shield className="w-5 h-5 text-rose-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-black text-slate-950 tracking-tighter">{isPremium ? result.sensitivityScore : '??'}</span>
                <span className="text-2xl font-bold text-slate-300">%</span>
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-12">
              Neural reactivity score across mapped cutaneous sectors.
            </p>
          </div>
        </div>
      </div>

      {/* Health Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-100 rounded-[2rem] p-10 flex flex-col justify-between group hover:border-emerald-200 transition-all">
          <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
            <Heart className="w-7 h-7 text-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Vitality Score</p>
            <p className="text-4xl font-black text-slate-900">{isPremium ? result.healthScore : '--'}<span className="text-base font-bold text-slate-300 ml-1">PT</span></p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-[2rem] p-10 flex flex-col justify-between group hover:border-amber-200 transition-all">
          <div className="bg-amber-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
            <Target className="w-7 h-7 text-amber-500" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bio-Age Index</p>
            <p className="text-4xl font-black text-slate-900">{isPremium ? result.ageIndex : '--'}<span className="text-base font-bold text-slate-300 ml-1">YR</span></p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-[2rem] p-10 flex flex-col justify-between group hover:border-indigo-200 transition-all">
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
