import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import Category from "./pages/Category";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Checkout from "./pages/Checkout";
import { CartProvider, useCart } from "./context/CartContext";

// ==========================================
// 1. NAVBAR COMPONENT
// ==========================================
function Navbar() {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation(); // 👈 Tells the navbar when the page changes

  // States
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customerName, setCustomerName] = useState<string | null>(null); // 👈 Stores the logged-in name

  // Check for logged-in user every time the URL changes
  useEffect(() => {
    const savedName = localStorage.getItem("customerName");
    setCustomerName(savedName);
  }, [location.pathname]);

  // Load wishlist count
  useEffect(() => {
    const updateWishlistCount = () => {
      const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlistCount(savedWishlist.length);
    };

    updateWishlistCount();
    window.addEventListener("wishlistUpdated", updateWishlistCount);

    return () => {
      window.removeEventListener("wishlistUpdated", updateWishlistCount);
    };
  }, []);

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Secure Logout Handler
  const handleLogout = () => {
    // 1. Destroy Security Tokens & Identity
    localStorage.removeItem("token");
    localStorage.removeItem("customerName");
    setCustomerName(null);
    
    // 2. Empty the Shopping Cart & Wishlist memory!
    localStorage.removeItem("wishlist"); 
    localStorage.removeItem("cart"); // (Or whatever key your CartContext uses)

    // 3. Dispatch an event to instantly hide the wishlist notification bubble
    window.dispatchEvent(new Event("wishlistUpdated"));

    // 4. Force a hard reload to completely wipe React's memory and send them home
    window.location.href = "/"; 
  };

  return (
    <nav className="w-full bg-[#fcfcfc] border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-8 text-[10px] font-bold tracking-[0.2em] text-[#1a2238]">
        <Link to="/shop" className="hover:text-[#c2a67a] transition-colors uppercase">Collections</Link>
        <Link to="/about" className="hover:text-[#c2a67a] transition-colors uppercase">Our Story</Link>
      </div>

      {/* Logo */}
      <Link to="/" className="text-center flex-1 md:flex-none block no-underline">
        <h1 
          className="text-2xl font-normal tracking-wide" 
          style={{ fontFamily: "'Grand Hotel', cursive", color: '#c2a67a', margin: 0 }}
        >
          Bangalore Collective
        </h1>
        <h2 
          className="uppercase mt-1" 
          style={{ color: '#a5aebf', fontSize: '8px', letterSpacing: '0.3em', display: 'block' }}
        >
          Fine Jewellery
        </h2>
      </Link>

      {/* Icons */}
      <div className="flex items-center gap-6 text-[#1a2238]">
        
        {/* Dynamic Search Bar */}
        <div className="relative flex items-center">
          {isSearchOpen ? (
            <form onSubmit={handleSearchSubmit} className="flex items-center border-b border-[#c2a67a] pb-1 transition-all duration-300 w-32 md:w-48">
              <input
                type="text"
                autoFocus
                placeholder="Search pieces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs tracking-widest outline-none w-full placeholder-gray-400 text-[#1a2238]"
              />
              <button 
                type="button" 
                onClick={() => setIsSearchOpen(false)} 
                className="ml-2 text-gray-400 hover:text-[#1a2238] text-xs transition-colors"
              >
                ✕
              </button>
            </form>
          ) : (
            <button 
              onClick={() => setIsSearchOpen(true)} 
              className="hover:text-[#c2a67a] transition-colors"
              title="Search"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
          )}
        </div>
        
        {/* 🛑 CONDITIONAL PROFILE / GREETING SECTION */}
        {customerName ? (
          <div className="relative group py-2">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#c2a67a] cursor-pointer">
              Hi, {customerName.split(' ')[0]} {/* Grabs just their first name */}
            </span>
            {/* Invisible hover bridge to keep dropdown open */}
            <div className="absolute top-full right-0 w-32 h-4 bg-transparent" />
            {/* Dropdown Menu */}
            <div className="absolute top-[calc(100%+0.5rem)] right-0 bg-white border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-40 flex flex-col items-start z-50">
              <button 
                onClick={handleLogout}
                className="text-[10px] w-full text-left px-6 font-bold tracking-[0.2em] uppercase text-gray-400 hover:text-[#1a2238] transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <Link to="/login" className="hover:text-[#c2a67a] transition-colors py-2" title="Login">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </Link>
        )}

        {/* Wishlist Icon */}
        <Link to="/wishlist" className="hover:text-[#c2a67a] transition-colors relative" title="Private Collection">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md border border-[#fcfcfc]">
              {wishlistCount}
            </span>
          )}
        </Link>

        {/* Cart Icon */}
        <Link to="/cart" className="hover:text-[#c2a67a] transition-colors relative">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-[#1a2238] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-[#fcfcfc]">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

// ==========================================
// 2. FOOTER COMPONENT
// ==========================================
function Footer() {
  return (
    <footer className="bg-[#1a2238] text-white py-12 text-center mt-auto">
      <h4
        className="text-4xl md:text-5xl mb-6 tracking-wide font-normal drop-shadow-sm" 
        style={{ fontFamily: "'Grand Hotel', cursive", color: "#d4af37" }}
      >
        Bangalore Collective
      </h4>
      <div className="flex flex-wrap justify-center gap-6 text-[10px] font-bold tracking-[0.2em] text-[#8a94a6] mb-8 uppercase">
        <Link to="/about" className="hover:text-[#c2a67a] transition-colors">Our Story</Link>
        <Link to="/privacy-policy" className="hover:text-[#c2a67a] transition-colors">Privacy Policy</Link>
        <Link to="/terms" className="hover:text-[#c2a67a] transition-colors">Terms & Conditions</Link>
      </div>
      <p className="text-[10px] tracking-[0.2em] text-[#4a5568]">
        © 2026 KORAMANGALA, BANGALORE. ALL RIGHTS RESERVED.
      </p>
    </footer>
  );
}

// ==========================================
// 3. MAIN APP ROUTER
// ==========================================
export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-[#fafafa] font-sans flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/category/:name" element={<Category />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}