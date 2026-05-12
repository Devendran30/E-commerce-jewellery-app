import { useState } from "react";
import api from "../api/axios";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // 1. Authenticate the User
        const res = await api.post("/auth/login", { email, password });
        const token = res.data.token;
        localStorage.setItem("token", token);
        
        const userName = res.data.user?.name || res.data.name || "Member";
        localStorage.setItem("customerName", userName); 

        // 2. Fetch User's Saved Cart & Wishlist from Backend Database
        try {
          // Tell axios to use the brand new token for these specific requests
          const config = { headers: { Authorization: `Bearer ${token}` } };
          
          // Fetch Wishlist and save back to browser
          const wishlistRes = await api.get("/wishlist", config);
          if (wishlistRes.data && Array.isArray(wishlistRes.data)) {
             localStorage.setItem("wishlist", JSON.stringify(wishlistRes.data));
             window.dispatchEvent(new Event("wishlistUpdated")); // Updates the Navbar bubble
          }

          // Fetch Cart and save back to browser
          const cartRes = await api.get("/cart", config);
          if (cartRes.data && Array.isArray(cartRes.data)) {
             localStorage.setItem("cart", JSON.stringify(cartRes.data));
          }
        } catch (fetchErr) {
          // If the backend routes aren't built yet, it will safely ignore this and continue
          console.log("No previous cart/wishlist found or backend routes not ready yet.");
        }

        // 3. Force a hard reload to completely refresh React's memory with the new data
        window.location.href = "/"; 
      } else {
        // --- NEW USER SIGNUP ---
        const fullName = `${firstName} ${lastName}`.trim();
        await api.post("/auth/signup", { name: fullName, email, password });
        
        // Auto-login after signup
        const res = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("customerName", fullName);
        
        window.location.href = "/";
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-6 py-16 bg-[#fafafa]">
      
      {/* Luxury Form Card */}
      <div className="w-full max-w-[440px] bg-white px-10 py-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 relative">
        
        {/* Subtle Gold Top Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-[#c2a67a]"></div>

        <div className="text-center mb-12 mt-2">
          <h1 
            className="text-4xl font-serif italic mb-3"
            style={{ color: "#1a2238" }}
          >
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p 
            className="text-[9px] tracking-[0.25em] uppercase font-bold"
            style={{ color: "#8a94a6" }}
          >
            {isLogin ? "Access your private portfolio" : "Join the Bangalore Collective"}
          </p>
        </div>

        {error && (
          <div className="mb-8 text-center text-[10px] text-red-600 tracking-widest border-l-2 border-red-500 py-3 px-4 bg-red-50/50 uppercase font-bold">
            {error}
          </div>
        )}

        <form className="space-y-8" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="grid grid-cols-2 gap-6">
              <input
                required
                type="text"
                placeholder="FIRST NAME"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-transparent border-b border-gray-200 pb-3 text-xs tracking-widest focus:outline-none transition-colors placeholder-gray-400 text-[#1a2238]"
                style={{ outline: "none" }}
                onFocus={(e) => e.target.style.borderColor = "#c2a67a"}
                onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
              />
              <input
                required
                type="text"
                placeholder="LAST NAME"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-transparent border-b border-gray-200 pb-3 text-xs tracking-widest focus:outline-none transition-colors placeholder-gray-400 text-[#1a2238]"
                style={{ outline: "none" }}
                onFocus={(e) => e.target.style.borderColor = "#c2a67a"}
                onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>
          )}

          <input
            required
            type="email"
            placeholder="EMAIL ADDRESS"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-b border-gray-200 pb-3 text-xs tracking-widest focus:outline-none transition-colors placeholder-gray-400 text-[#1a2238]"
            style={{ outline: "none" }}
            onFocus={(e) => e.target.style.borderColor = "#c2a67a"}
            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
          />
          
          <input
            required
            type="password"
            placeholder="PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-b border-gray-200 pb-3 text-xs tracking-widest focus:outline-none transition-colors placeholder-gray-400 text-[#1a2238]"
            style={{ outline: "none" }}
            onFocus={(e) => e.target.style.borderColor = "#c2a67a"}
            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
          />

          {/* Submit Button - Now with Gold Hover Transition */}
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white text-[10px] font-bold tracking-[0.2em] py-4 mt-4 uppercase transition-all duration-500 disabled:opacity-60 disabled:cursor-not-allowed border border-transparent"
            style={{ 
              backgroundColor: loading ? "#8a94a6" : "#1a2238",
            }}
            onMouseEnter={(e) => { if(!loading) e.currentTarget.style.backgroundColor = "#c2a67a"; }}
            onMouseLeave={(e) => { if(!loading) e.currentTarget.style.backgroundColor = "#1a2238"; }}
          >
            {loading ? "Authenticating..." : isLogin ? "Sign In" : "Register"}
          </button>
        </form>

        <div className="mt-10 text-center">
          {/* Subtle Toggle Link */}
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            className="text-[9px] font-bold tracking-[0.15em] uppercase pb-1 border-b border-transparent transition-all duration-300"
            style={{ color: "#8a94a6" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#c2a67a";
              e.currentTarget.style.borderColor = "#c2a67a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#8a94a6";
              e.currentTarget.style.borderColor = "transparent";
            }}
          >
            {isLogin ? "Create a new account" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}