import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, Mail, KeyRound, ArrowRight, AlertCircle, RefreshCw } from "lucide-react";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let newCaptcha = "";
    for (let i = 0; i < 6; i++) {
      newCaptcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(newCaptcha);
  };

  useEffect(() => {
    generateCaptcha();
    const savedEmail = localStorage.getItem("rememberedAdminEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. Validate Captcha
    if (captchaInput.toLowerCase() !== captcha.toLowerCase()) {
      setError("Invalid security code. Please try again.");
      generateCaptcha(); 
      setCaptchaInput("");
      setLoading(false);
      return;
    }

    try {
      // 2. Send Request to Render Backend
      const response = await api.post("/auth/login", { 
        email, 
        password 
      });

      if (response.data) {
        const { user, token } = response.data;

        // 3. ROLE CHECK: Ensure only Admins can enter
        // Note: Make sure your backend sends back user.role
        if (user && user.role !== 'admin') {
          throw new Error("Access denied. You do not have admin privileges.");
        }

        // 4. Handle "Remember Me"
        if (rememberMe) {
          localStorage.setItem("rememberedAdminEmail", email);
        } else {
          localStorage.removeItem("rememberedAdminEmail");
        }

        // 5. Store Auth Data
        localStorage.setItem("isAdminAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(user));
        if (token) {
           localStorage.setItem("token", token);
        }
        
        // 6. Redirect to Dashboard
        navigate("/");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(
        err.response?.data?.message || 
        err.message ||
        "Invalid credentials. Access denied."
      );
      generateCaptcha();
      setCaptchaInput("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1423] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#c2a67a] opacity-[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-[#1a2238] opacity-50 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-[1000px] w-full relative z-10 animate-fade-in flex flex-col md:flex-row bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
        
        {/* LEFT SIDE: BRANDING */}
        <div className="hidden md:flex md:w-1/2 relative flex-col justify-end p-12 overflow-hidden border-r border-white/5">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d17] via-[#0a0d17]/80 to-[#0a0d17]/20" />

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-black/50 backdrop-blur-md border border-white/10 rounded-xl text-[#c2a67a] mb-6">
              <ShieldCheck size={24} strokeWidth={1.5} />
            </div>
            <h2 className="tracking-[0.4em] uppercase text-[10px] text-[#c2a67a] font-bold mb-3">Executive Access</h2>
            <h1 className="font-serif italic text-4xl text-white tracking-wide drop-shadow-md mb-4 leading-tight">Bangalore Jewellery</h1>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">Exquisite, hand-crafted artisan designs from the heart of Karnataka.</p>
          </div>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 relative flex flex-col justify-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#c2a67a]/40 via-[#c2a67a] to-[#c2a67a]/40" />

          <div className="mb-8 hidden md:block">
            <h2 className="text-2xl font-serif italic text-white mb-2">Sign In</h2>
            <p className="text-xs text-gray-500 tracking-widest uppercase text-balance">Enter your credentials to access the dashboard</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-start gap-3 text-xs font-medium animate-fade-in">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase ml-1">Email</label>
              <div className="relative flex items-center group">
                <Mail size={16} className="absolute left-4 text-gray-500 group-focus-within:text-[#c2a67a] transition-colors" />
                <input 
                  type="email" 
                  className="w-full bg-[#0a0d17]/50 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm text-white focus:border-[#c2a67a] focus:bg-[#0a0d17] outline-none transition-all placeholder:text-gray-600"
                  placeholder="admin@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase ml-1">Password</label>
              <div className="relative flex items-center group">
                <KeyRound size={16} className="absolute left-4 text-gray-500 group-focus-within:text-[#c2a67a] transition-colors" />
                <input 
                  type="password" 
                  className="w-full bg-[#0a0d17]/50 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm text-white focus:border-[#c2a67a] focus:bg-[#0a0d17] outline-none transition-all placeholder:text-gray-600 tracking-widest"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#0a0d17] border-white/10 text-[#c2a67a] accent-[#c2a67a]"
                />
                <span className="text-[10px] uppercase tracking-[0.1em] text-gray-400 group-hover:text-gray-300">Remember me</span>
              </label>
              <a href="#" className="text-[10px] text-[#c2a67a] hover:text-white transition-colors tracking-wider uppercase font-bold">Forgot Password?</a>
            </div>

            <div className="pt-2">
              <label className="block text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase ml-1 mb-2">Security Code</label>
              <div className="flex gap-3">
                <div className="flex-1 flex items-center justify-between bg-[#0a0d17]/80 border border-white/10 rounded-xl px-4 py-3 select-none">
                  <span className="text-[#c2a67a] font-mono text-xl tracking-[0.3em] font-bold italic drop-shadow-md">{captcha}</span>
                  <button type="button" onClick={generateCaptcha} className="text-gray-500 hover:text-white transition-colors"><RefreshCw size={16} /></button>
                </div>
                <input 
                  type="text" 
                  className="w-2/5 bg-[#0a0d17]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-center text-white focus:border-[#c2a67a] outline-none font-mono tracking-widest"
                  placeholder="CODE"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || captchaInput.length !== 6}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#c2a67a] to-[#b09468] text-white py-4 mt-6 rounded-xl text-[11px] font-black tracking-[0.2em] uppercase hover:shadow-[0_0_20px_rgba(194,166,122,0.3)] transition-all disabled:opacity-50"
            >
              {loading ? "Authenticating..." : <><Lock size={14} /> Sign In <ArrowRight size={14} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}