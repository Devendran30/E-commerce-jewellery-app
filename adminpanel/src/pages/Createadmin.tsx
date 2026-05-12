import { useState } from "react";
import api from "../api/axios";
import { UserPlus, ShieldCheck, Mail, Lock, User } from "lucide-react";

export default function CreateAdmin() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "admin"
      });
      
      setMessage({ type: "success", text: "New admin created successfully!" });
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.error || "Failed to create admin." });
    } finally {
      setLoading(false);
    }
  };

  // Helper for input styling
  const inputStyle = {
    borderBottom: '2px solid #e5e7eb',
    color: '#1a1a1a',
    backgroundColor: 'transparent',
    outline: 'none',
    width: '100%',
    transition: 'all 0.3s',
    fontWeight: '500'
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderBottomColor = '#c2a67a';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderBottomColor = '#e5e7eb';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10 py-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif italic mb-2" style={{ color: '#c2a67a' }}>
          Privilege Management
        </h1>
        <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: '#1a1a1a' }}>
          Create new executive credentials
        </p>
      </div>

      <div className="bg-white border-none rounded-xl shadow-xl overflow-hidden">
        
        {/* Card Header */}
        <div className="p-8 flex items-center gap-6" style={{ backgroundColor: '#1a1a1a' }}>
          <div className="p-4 rounded-full" style={{ backgroundColor: '#c2a67a', color: '#1a1a1a' }}>
            <UserPlus size={24} />
          </div>
          <div>
            <h2 className="text-white text-xs font-black tracking-[0.2em] uppercase">
              Add New Administrator
            </h2>
            <p className="text-[10px] uppercase tracking-[0.3em] mt-1" style={{ color: '#c2a67a' }}>
              Access level: Full Executive
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-10 space-y-10">
          {message.text && (
            <div className={`p-4 rounded-md text-[10px] font-black tracking-widest uppercase ${
              message.type === "success" 
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                : "bg-rose-50 text-rose-600 border border-rose-100"
            }`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 gap-10">
            {/* Full Name */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: '#c2a67a' }}>
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-0 top-3" style={{ color: '#a5aebf' }} size={18} />
                <input
                  required
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  className="pl-8 pr-4 py-3 text-sm"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: '#c2a67a' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-0 top-3" style={{ color: '#a5aebf' }} size={18} />
                <input
                  required
                  type="email"
                  placeholder="admin@bangalorecollective.com"
                  className="pl-8 pr-4 py-3 text-sm"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: '#c2a67a' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-0 top-3" style={{ color: '#a5aebf' }} size={18} />
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    className="pl-8 pr-4 py-3 text-sm tracking-widest"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: '#c2a67a' }}>
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-0 top-3" style={{ color: '#a5aebf' }} size={18} />
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    className="pl-8 pr-4 py-3 text-sm tracking-widest"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full py-6 mt-4 rounded font-black text-[11px] tracking-[0.3em] uppercase transition-all shadow-md flex items-center justify-center gap-3"
            style={{ 
              backgroundColor: '#c2a67a', 
              color: '#ffffff',
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              border: 'none'
            }}
          >
            {loading ? "Processing..." : (
              <>
                <ShieldCheck size={18} />
                Authorize New Admin
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}