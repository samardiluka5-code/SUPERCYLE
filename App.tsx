
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { Compliance } from './components/Compliance';
import { ApiDocs } from './components/ApiDocs';
import { AppState, SkinAnalysisResult, User, Plan } from './types';
import { analyzeSkin } from './services/geminiService';
import { 
  Loader2, 
  LogOut, 
  Check, 
  Lock, 
  X,
  Zap,
  Globe,
  ShieldAlert,
  Mail,
  Fingerprint,
  User as UserIcon
} from 'lucide-react';

type View = 'APP' | 'COMPLIANCE' | 'API_DOCS';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('APP');
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<SkinAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Manual Auth Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('dermai_user_session');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!validateEmail(email)) {
      setAuthError("Please enter a valid email address.");
      return;
    }

    if (authMode === 'SIGNUP' && name.trim().length < 2) {
      setAuthError("Please enter your full name.");
      return;
    }

    setIsAuthenticating(true);
    
    setTimeout(() => {
      const userData: User = {
        id: 'usr_' + Date.now(),
        name: authMode === 'SIGNUP' ? name : 'Professional User',
        email: email,
        plan: 'FREE'
      };
      setUser(userData);
      localStorage.setItem('dermai_user_session', JSON.stringify(userData));
      setShowAuthModal(false);
      setIsAuthenticating(false);
      resetAuthForm();
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setIsAuthenticating(true);
    setAuthError(null);
    
    // Direct Google Authentication Simulation
    setTimeout(() => {
      const userData: User = {
        id: 'google_' + Math.random().toString(36).substr(2, 9),
        name: 'Google User',
        email: 'user@gmail.com',
        plan: 'FREE'
      };
      setUser(userData);
      localStorage.setItem('dermai_user_session', JSON.stringify(userData));
      setShowAuthModal(false);
      setIsAuthenticating(false);
    }, 1500);
  };

  const resetAuthForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setAuthError(null);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('dermai_user_session');
    setResult(null);
    setState(AppState.IDLE);
    setCurrentView('APP');
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
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
    if (!user) { setShowAuthModal(true); return; }
    setState(AppState.ANALYZING);
    try {
      const analysis = await analyzeSkin(base64);
      setResult(analysis);
      setState(AppState.RESULT);
    } catch (err: any) {
      setError(err.message || "Diagnostic failure.");
      setState(AppState.ERROR);
    }
  };

  const renderContent = () => {
    if (currentView === 'COMPLIANCE') return <Compliance onBack={() => setCurrentView('APP')} />;
    if (currentView === 'API_DOCS') return <ApiDocs onBack={() => setCurrentView('APP')} />;

    if (state === AppState.IDLE) {
      return (
        <div className="max-w-5xl mx-auto space-y-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="text-center space-y-12">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-slate-50 text-slate-900 rounded-full border border-slate-200 text-[10px] font-black uppercase tracking-[0.3em] animate-float">
              <Globe className="w-4 h-4" /> Professional Skin Diagnostics
            </div>
            <h1 className="text-7xl md:text-[6.5rem] font-black text-slate-950 leading-[0.85] tracking-[-0.05em]">
              PRECISION <br/> <span className="text-slate-200">EPIDERMIS</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed tracking-tight">
              Clinical-grade skin analysis. Instantly identify skin types and concerns to unlock professional-standard skincare regimens.
            </p>
            <div className="pt-12">
              <ImageUploader onImageSelected={handleImageAnalysis} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-slate-100">
            {[
              { title: "Smart Analysis", desc: "Advanced neural networks map your skin texture and type using high-resolution image processing." },
              { title: "Custom Protocols", desc: "Tailored routines matched against dermatological standards for your unique skin profile." },
              { title: "Encrypted Data", desc: "Your privacy is our priority. All diagnostic results are stored securely and remain under your control." }
            ].map((f, i) => (
              <div key={i} className="space-y-6 group">
                <div className="w-12 h-1 bg-slate-100 group-hover:bg-slate-950 group-hover:w-20 transition-all duration-500" />
                <h3 className="text-lg font-black text-slate-950 uppercase tracking-tighter">{f.title}</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (state === AppState.ANALYZING) {
      return (
        <div className="flex flex-col items-center justify-center py-40 space-y-12">
          <div className="relative">
            <div className="w-32 h-32 border border-slate-100 rounded-full" />
            <div className="absolute inset-0 border-t-2 border-slate-950 rounded-full animate-spin" />
          </div>
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-black text-slate-950 uppercase tracking-[0.2em]">Processing Sample</h3>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Identifying Dermal Metrics and Bio-Factors</p>
          </div>
        </div>
      );
    }

    if (state === AppState.RESULT && result) {
      return (
        <AnalysisResult 
          result={result} 
          user={user} 
          onReset={() => setState(AppState.IDLE)} 
          onUpgrade={() => setShowPaymentModal(true)} 
        />
      );
    }

    if (state === AppState.ERROR) {
      return (
        <div className="flex flex-col items-center justify-center py-40 space-y-8 animate-in fade-in">
          <ShieldAlert className="w-16 h-16 text-rose-500" />
          <h3 className="text-2xl font-black text-slate-950 uppercase tracking-widest">Analysis Error</h3>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">{error}</p>
          <button onClick={() => setState(AppState.IDLE)} className="px-10 py-4 bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Retry Diagnostics</button>
        </div>
      );
    }
  };

  return (
    <Layout onNavigate={setCurrentView}>
      {/* Session Management Header */}
      <div className="fixed top-6 right-8 z-[60]">
        {user ? (
          <div className="flex items-center gap-6 bg-white border border-slate-100 pl-6 pr-2 py-2 rounded-full shadow-2xl transition-all">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Authorized Session</span>
              <span className="text-xs font-bold text-slate-950 tracking-tight">{user.email}</span>
            </div>
            <button onClick={handleLogout} className="bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 p-2 rounded-full transition-all">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => { setAuthMode('LOGIN'); setShowAuthModal(true); }} 
            className="bg-slate-950 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-800 transition-all shadow-xl active:scale-95"
          >
            Sign In
          </button>
        )}
      </div>

      {renderContent()}

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={() => !isAuthenticating && setShowAuthModal(false)} />
          <div className="relative bg-white rounded-[2.5rem] p-12 md:p-16 max-w-lg w-full shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
            {!isAuthenticating && (
              <button onClick={() => setShowAuthModal(false)} className="absolute top-10 right-10 text-slate-300 hover:text-slate-950 transition-colors">
                <X className="w-6 h-6" />
              </button>
            )}
            <div className="mb-10 text-center md:text-left">
              <div className="bg-slate-950 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 mx-auto md:mx-0">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-4xl font-black text-slate-950 uppercase tracking-tighter leading-none">
                {authMode === 'LOGIN' ? 'Welcome Back' : 'Get Started'} <br/><span className="text-slate-200">Secure Account.</span>
              </h2>
            </div>
            
            <div className="space-y-6">
              {/* One-Click Google Authentication */}
              <button 
                onClick={handleGoogleLogin}
                disabled={isAuthenticating}
                className="w-full flex items-center justify-center gap-3 py-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-slate-950 transition-all group disabled:opacity-50"
              >
                {isAuthenticating ? (
                  <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    </svg>
                    <span className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-600 group-hover:text-slate-950">Continue with Google</span>
                  </>
                )}
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink mx-4 text-[9px] font-black text-slate-300 uppercase tracking-widest">Or Email</span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>

              {authError && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-bold text-rose-700 uppercase tracking-wide leading-relaxed">{authError}</p>
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-4">
                {authMode === 'SIGNUP' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input required disabled={isAuthenticating} type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. John Smith" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:bg-white focus:border-slate-950 transition-all outline-none disabled:opacity-50" />
                    </div>
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input required disabled={isAuthenticating} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@domain.com" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:bg-white focus:border-slate-950 transition-all outline-none disabled:opacity-50" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative">
                    <Fingerprint className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input required disabled={isAuthenticating} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your secure password" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:bg-white focus:border-slate-950 transition-all outline-none disabled:opacity-50" />
                  </div>
                </div>
                <button disabled={isAuthenticating} type="submit" className="w-full py-5 bg-slate-950 text-white text-xs font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-slate-800 transition-all shadow-2xl active:scale-95 mt-4 flex items-center justify-center gap-3">
                  {isAuthenticating ? <Loader2 className="w-5 h-5 animate-spin" /> : (authMode === 'LOGIN' ? 'Sign In' : 'Create Account')}
                </button>
              </form>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-50 text-center">
              <button disabled={isAuthenticating} onClick={() => setAuthMode(authMode === 'LOGIN' ? 'SIGNUP' : 'LOGIN')} className="text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-950 transition-colors disabled:opacity-50">
                {authMode === 'LOGIN' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment/Subscription Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl" onClick={() => !isProcessingPayment && setShowPaymentModal(false)} />
          <div className="relative bg-white rounded-[3rem] overflow-hidden max-w-5xl w-full shadow-2xl border border-slate-200 flex flex-col md:flex-row animate-in zoom-in-95 duration-500">
            <div className="w-full md:w-5/12 bg-slate-950 p-16 text-white flex flex-col justify-between border-r border-slate-800">
              <div className="space-y-12">
                <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white fill-current" />
                </div>
                <div>
                  <h2 className="text-5xl font-black uppercase tracking-tighter mb-6 leading-none">UPGRADE <br/><span className="text-slate-600 text-3xl">TIER.</span></h2>
                  <div className="space-y-6">
                    {["Full Dermal Morphometry", "Clinical Product Matching", "Longitudinal Tracking"].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <Check className="w-4 h-4 text-emerald-500" /> {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="pt-12 border-t border-white/5">
                <div className="text-5xl font-black text-white tracking-tighter">$19.99<span className="text-sm font-bold text-slate-600 uppercase tracking-widest ml-2">Monthly</span></div>
              </div>
            </div>

            <div className="w-full md:w-7/12 p-16 relative">
              <button onClick={() => !isProcessingPayment && setShowPaymentModal(false)} className="absolute top-12 right-12 text-slate-200 hover:text-slate-950 transition-colors">
                <X className="w-8 h-8" />
              </button>
              <h3 className="text-2xl font-black text-slate-950 mb-12 uppercase tracking-tighter">Billing Authorization</h3>
              <form onSubmit={handlePayment} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cardholder Name</label>
                  <input required type="text" placeholder="Name as on card" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Number</label>
                  <input required type="text" placeholder="0000 0000 0000 0000" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <input required type="text" placeholder="MM / YY" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none" />
                  <input required type="text" placeholder="CVC" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none" />
                </div>
                <button disabled={isProcessingPayment} type="submit" className="w-full py-6 bg-slate-950 text-white text-xs font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-slate-800 transition-all shadow-2xl disabled:opacity-50 mt-8">
                  {isProcessingPayment ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Authorize Payment"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
