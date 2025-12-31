
import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/mockService.ts';
import { User } from '../types.ts';
import { PRICING, ICONS } from '../constants.tsx';
import { Shield, Lock, Smartphone, ArrowRight, UserCheck, AlertCircle, Info, Mail } from 'lucide-react';

interface AuthPageProps {
  onSuccess: (user: User) => void;
  onAdminLogin: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onAdminLogin }) => {
  // Use environment variable or fallback to placeholder
  const GOOGLE_CLIENT_ID = (typeof process !== 'undefined' && process.env?.GOOGLE_CLIENT_ID) || 'YOUR_REAL_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com';
  
  // Logic to determine if we should attempt a real GSI login or use Sandbox
  const isInvalidId = !GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes('YOUR_REAL_GOOGLE');

  const [googleUser, setGoogleUser] = useState<{ email: string; name: string; picture: string } | null>(null);
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [refCode, setRefCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'identity' | 'onboarding' | 'payment'>('identity');
  const [error, setError] = useState('');
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('ref');
    if (code) setRefCode(code);

    // Only initialize Google script if the ID looks valid to avoid GeneralOAuthFlow error
    if (typeof window !== 'undefined' && (window as any).google && !isInvalidId) {
      try {
        (window as any).google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        
        if (googleBtnRef.current) {
          (window as any).google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'filled_blue',
            size: 'large',
            width: googleBtnRef.current.offsetWidth,
            text: 'continue_with',
            shape: 'pill'
          });
        }
      } catch (e) {
        console.warn("GSI rendering skipped: Invalid configuration.");
      }
    }
  }, [GOOGLE_CLIENT_ID, isInvalidId]);

  const handleCredentialResponse = (response: any) => {
    setLoading(true);
    try {
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);

      processProfile({
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      });
    } catch (err) {
      setError('Google verification failed. Use Sandbox mode to continue.');
      setLoading(false);
    }
  };

  const simulateGoogleLogin = () => {
    setLoading(true);
    // Mimic network delay for realism
    setTimeout(() => {
      processProfile({
        email: "earnlink.demo@gmail.com",
        name: "Kenyan Earner",
        picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kenya&backgroundColor=b6e3f4"
      });
    }, 800);
  };

  const processProfile = (profile: { email: string; name: string; picture: string }) => {
    const existingUser = api.getUserByEmail(profile.email);
    if (existingUser) {
      api.login(existingUser.id);
      onSuccess(existingUser);
    } else {
      setGoogleUser(profile);
      setUsername(profile.name);
      setStep('onboarding');
    }
    setLoading(false);
  };

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !phone) return;
    
    const cleanPhone = phone.replace(/\s+/g, '');
    const isKenyan = /^(?:254|\+254|0)?([17]\d{8})$/.test(cleanPhone);
    
    if (!isKenyan) {
      setError('Invalid M-Pesa number. Use 07XX or 01XX format.');
      return;
    }
    
    setError('');
    setStep('payment');
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const user = await api.signUp(username, phone, googleUser?.email, googleUser?.picture, refCode);
      onSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Payment failed.');
      setStep('onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md glass-card rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden border border-white/10">
        
        {/* Background Glows */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 blur-[80px] pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-400/10 blur-[80px] pointer-events-none"></div>

        {step === 'identity' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <header className="text-center">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-emerald-400 border border-emerald-500/20 shadow-inner">
                <Shield className="w-10 h-10" />
              </div>
              <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">Secure Entry</h2>
              <p className="text-emerald-400/60 text-sm font-medium">Verify your identity to start earning</p>
            </header>

            <div className="space-y-4">
              {/* Real Google Button Container (Only if ID is valid) */}
              {!isInvalidId && (
                <div className="w-full flex justify-center mb-2">
                  <div ref={googleBtnRef} className="w-full min-h-[44px]"></div>
                </div>
              )}

              {/* Sandbox Login - High fidelity button */}
              <button 
                onClick={simulateGoogleLogin}
                disabled={loading}
                className="w-full py-4 bg-white hover:bg-emerald-50 text-gray-900 font-black rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 relative overflow-hidden group"
              >
                {loading ? (
                  <div className="w-5 h-5 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="G" />
                    </div>
                    {isInvalidId ? "Sandbox Sign-In" : "Try Alternative Login"}
                  </>
                )}
              </button>

              {isInvalidId && (
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex gap-3 items-start animate-pulse">
                  <Info className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Sandbox Active</p>
                    <p className="text-[10px] text-emerald-100/40 leading-relaxed">
                      Google Client ID not detected. Using local simulation for rapid testing.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-1 bg-white/5"></div>
              <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Encrypted Network</span>
              <div className="h-px flex-1 bg-white/5"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/5 flex flex-col items-center text-center">
                <Lock className="w-5 h-5 text-emerald-500/40 mb-2" />
                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">SSL Secure</span>
              </div>
              <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/5 flex flex-col items-center text-center">
                <Smartphone className="w-5 h-5 text-emerald-500/40 mb-2" />
                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Verified Pay</span>
              </div>
            </div>

            <button 
              onClick={() => {
                api.loginAsAdmin();
                onAdminLogin();
              }}
              className="w-full text-[10px] text-white/10 hover:text-emerald-500/40 transition-colors uppercase tracking-[0.4em] font-black pt-4"
            >
              Management Access
            </button>
          </div>
        )}

        {step === 'onboarding' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
            <header>
              <div className="flex items-center gap-4 mb-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-emerald-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <img src={googleUser?.picture} className="w-16 h-16 rounded-[1.5rem] border-2 border-emerald-500/40 relative z-10" alt="Avatar" />
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 z-20 shadow-lg">
                    <UserCheck className="w-3 h-3 text-emerald-950" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">Hujambo, {googleUser?.name.split(' ')[0]}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-3 h-3 text-emerald-400/40" />
                    <p className="text-[10px] text-emerald-400/60 font-mono tracking-tighter truncate max-w-[150px]">{googleUser?.email}</p>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Configure Payouts</h2>
              <p className="text-emerald-400/60 text-sm">Where should we send your earnings?</p>
            </header>

            <form onSubmit={handleOnboardingSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60 ml-1">Unique Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-white font-bold placeholder:text-white/10"
                  placeholder="e.g. NairobiKing"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60 ml-1">M-Pesa Number (For Payouts)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 font-bold">+254</span>
                  <input 
                    type="tel" 
                    placeholder="7XX XXX XXX"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-white font-bold"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-3 animate-in shake duration-300">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-2xl py-5 shadow-2xl shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4"
              >
                Link Wallet & Continue <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {step === 'payment' && (
          <div className="text-center py-6 animate-in fade-in zoom-in-95 duration-700">
            <div className="w-28 h-28 bg-emerald-500/10 rounded-[3rem] flex items-center justify-center mx-auto mb-10 relative group">
              <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-[3rem] animate-spin duration-[3s]"></div>
              <Smartphone className="w-12 h-12 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            
            <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">Confirm Pay</h2>
            
            <div className="glass-card p-8 rounded-[2rem] border border-emerald-500/10 mb-10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/20">
                <div className="h-full bg-emerald-500 w-1/3 animate-[shimmer_2s_infinite]"></div>
              </div>
              <p className="text-xs text-emerald-400/60 uppercase tracking-[0.2em] font-black mb-1">Activation Amount</p>
              <p className="text-5xl font-black text-white mb-4">KES {PRICING.SIGN_UP_FEE}</p>
              <div className="h-px bg-white/5 mb-4"></div>
              <p className="text-[11px] text-emerald-100/30 leading-relaxed px-2">
                An STK Push has been sent to <span className="text-emerald-400 font-bold">{phone}</span>. Please enter your PIN to finalize your membership.
              </p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center gap-6 p-4">
                <div className="flex gap-2">
                  <span className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce"></span>
                  <span className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                </div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500 animate-pulse">Waiting for M-Pesa PIN...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <button 
                  onClick={handlePayment}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-2xl py-5 shadow-2xl transition-all active:scale-[0.98] border-b-4 border-emerald-700 active:border-b-0 text-lg"
                >
                  I have entered PIN
                </button>
                <button 
                  onClick={() => setStep('onboarding')}
                  className="w-full py-4 text-[10px] font-black text-white/20 hover:text-white/60 uppercase tracking-[0.2em] transition-colors"
                >
                  Edit phone number
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
