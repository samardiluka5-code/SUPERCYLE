
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { AppState, SkinAnalysisResult, User, Plan } from './types';
import { analyzeSkin } from './services/geminiService';
import { 
  Loader2, 
  Activity, 
  User as UserIcon, 
  LogOut, 
  Check, 
  ArrowRight, 
  CreditCard, 
  Lock, 
  Mail, 
  Key, 
  X,
  ShieldCheck,
  Zap
} from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<SkinAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  
  // Modal states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('dermai_user_session');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth logic
    const userData: User = {
      id: 'usr_' + Date.now(),
      name: authMode === 'SIGNUP' ? name : 'Clinical User',
      email: email,
      plan: 'FREE'
    };
    setUser(userData);
    localStorage.setItem('dermai_user_session', JSON.stringify(userData));
    setShowAuthModal(false);
    resetAuthForm();
  };

  const resetAuthForm = () => {
    setEmail('');
    setPassword('');
    setName('');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('dermai_user_session');
    setResult(null);
    setState(AppState.IDLE);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    // Simulate secure processing delay
    setTimeout(() => {
      if (user) {
        const upgradedUser = { ...user, plan: 'PREMIUM' as Plan };
        setUser(upgradedUser);
        localStorage.setItem('dermai_user_session', JSON.stringify(upgradedUser));
      }
      setIsProcessingPayment(false);
      setShowPaymentModal(false);
    }, 2000);
  };

  const handleImageAnalysis = async (base64: string) => {
    if (!user) { 
      setShowAuthModal(true); 
      return; 
    }
    setState(AppState.ANALYZING);
    try {
      const analysis = await analyzeSkin(base64);
      setResult(analysis);
      setState(AppState.RESULT);
    } catch (err: any) {
      setError(err.message || "Diagnostic failure. System interrupted.");
      setState(AppState.ERROR);
    }
  };

  return (
    <Layout>
      {/* Top Nav Controls */}
      <div className="fixed top-4 right-6 z-[60] flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-200 shadow-sm transition-all">
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Authorized Session</span>
              <span className="text-xs font-bold text-slate-900">{user.name}</span>
            </div>
            <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${user.plan === 'PREMIUM' ? 'bg-slate-900 text-emerald-400' : 'bg-slate-100 text-slate-500'}`}>
              {user.plan}
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-rose-500 transition-colors p-1">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => { setAuthMode('LOGIN'); setShowAuthModal(true); }} 
            className="bg-slate-900 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-lg"
          >
            Access Laboratory
          </button>
        )}
      </div>

      {state === AppState.IDLE && (
        <div className="max-w-4xl mx-auto space-y-24 pt-8 animate-in fade-in duration-1000">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-100 text-[10px] font-black uppercase tracking-[0.2em]">
              <Activity className="w-3.5 h-3.5" /> Clinical AI v3.14
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter">
              PRECISION <span className="text-slate-300">SKIN</span> DIAGNOSTICS.
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
              Harness computer vision to map epidermal health, detect irregularities, and engineer a clinical-grade regimen.
            </p>
            <div className="pt-8">
              <ImageUploader onImageSelected={handleImageAnalysis} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 border border-slate-200 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50">
            {[
              { title: "Epidermal Mapping", desc: "Analysis of 42 distinct textural zones using high-frequency neural processing." },
              { title: "Biometric Matching", desc: "Adaptive regimen synthesis based on environmental factors and skin bio-profile." },
              { title: "Clinical Curation", desc: "Direct matching to dermatological-grade ingredients and formulations." }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-10 space-y-4 hover:bg-slate-50 transition-colors group">
                <div className="w-2 h-2 rounded-full bg-slate-900 group-hover:scale-150 transition-transform" />
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tighter">{feature.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {state === AppState.ANALYZING && (
        <div className="flex flex-col items-center justify-center py-40 space-y-12">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
            <div className="absolute inset-0 border-4 border-slate-900 rounded-full border-t-emerald-500 animate-spin" />
          </div>
          <div className="text-center space-y-4">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-[0.2em]">Processing Session</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Analyzing Image Vectors
            </p>
          </div>
        </div>
      )}

      {state === AppState.RESULT && result && (
        <AnalysisResult 
          result={result} 
          user={user} 
          onReset={() => setState(AppState.IDLE)} 
          onUpgrade={() => setShowPaymentModal(true)} 
        />
      )}

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowAuthModal(false)} />
          <div className="relative bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in duration-200">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="mb-8 text-center">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                {authMode === 'LOGIN' ? 'Secure Login' : 'Create Profile'}
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-2">Access your clinical diagnostic data</p>
            </div>
            
            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'SIGNUP' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <input 
                      required 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Dr. Jane Smith"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all" 
                    />
                    <UserIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-300" />
                  </div>
                </div>
              )}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Institutional Email</label>
                <div className="relative">
                  <input 
                    required 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@institution.ai"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all" 
                  />
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-300" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Credentials</label>
                <div className="relative">
                  <input 
                    required 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all" 
                  />
                  <Key className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-300" />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="w-full py-4 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 mt-6"
              >
                {authMode === 'LOGIN' ? 'Authorize Access' : 'Initialize Profile'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button 
                onClick={() => setAuthMode(authMode === 'LOGIN' ? 'SIGNUP' : 'LOGIN')}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
              >
                {authMode === 'LOGIN' ? "Need a new profile?" : "Already registered?"} <span className="text-emerald-500 ml-1">Switch Mode</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Checkout Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => !isProcessingPayment && setShowPaymentModal(false)} />
          <div className="relative bg-white rounded-[2.5rem] overflow-hidden max-w-4xl w-full shadow-2xl border border-slate-200 flex flex-col md:flex-row animate-in zoom-in duration-300">
            {/* Left: Summary */}
            <div className="w-full md:w-5/12 bg-slate-900 p-12 text-white flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-emerald-400 rounded-md text-[9px] font-black uppercase tracking-widest mb-10 border border-white/10">
                  <Zap className="w-3.5 h-3.5 fill-current" /> Premium Upgrade
                </div>
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 leading-none">Complete<br/><span className="text-slate-500">Your Protocol.</span></h2>
                <div className="space-y-6 mt-12">
                  {[
                    "Biological Hydration Indices",
                    "Clinical Product Matching",
                    "Advanced Texture Vectors",
                    "Regimen Persistence"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-400">
                      <Check className="w-4 h-4 text-emerald-400" /> {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-12 border-t border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Subscription Fee</p>
                <div className="text-4xl font-black text-white tracking-tighter">$19.99<span className="text-sm font-medium text-slate-500">/mo</span></div>
              </div>
            </div>

            {/* Right: Payment Form */}
            <div className="w-full md:w-7/12 p-12 relative">
              <button 
                onClick={() => !isProcessingPayment && setShowPaymentModal(false)} 
                className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-xl font-bold text-slate-900 mb-8 uppercase tracking-tighter">Checkout Details</h3>
              
              <form onSubmit={handlePayment} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cardholder Name</label>
                    <input required type="text" placeholder="Johnathan Doe" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-slate-900/5 transition-all outline-none" />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Information</label>
                    <div className="relative">
                      <input required type="text" placeholder="0000 0000 0000 0000" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 pl-12 text-sm font-medium focus:ring-2 focus:ring-slate-900/5 transition-all outline-none" />
                      <CreditCard className="absolute left-4 top-3.5 w-5 h-5 text-slate-300" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiry Date</label>
                      <input required type="text" placeholder="MM/YY" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-slate-900/5 transition-all outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CVC Code</label>
                      <input required type="text" placeholder="000" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-slate-900/5 transition-all outline-none" />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
                  <ShieldCheck className="w-8 h-8 text-emerald-500" />
                  <div>
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Encrypted Processing</p>
                    <p className="text-[10px] text-slate-400 font-medium">Your credentials are never stored locally.</p>
                  </div>
                </div>

                <button 
                  disabled={isProcessingPayment}
                  type="submit" 
                  className="w-full py-5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying Transaction
                    </>
                  ) : (
                    <>Authorize $19.99 Payment</>
                  )}
                </button>
              </form>

              <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-6">
                Powered by Stripe Laboratory API v2.0
              </p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
