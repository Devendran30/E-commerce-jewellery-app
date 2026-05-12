import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingBag, Trash2 } from "lucide-react";

// --- BULLETPROOF IMAGE HELPER ---
const getImageUrl = (images: any) => {
  let path = "";

  if (typeof images === 'string' && images.startsWith('[')) {
    try {
      const parsed = JSON.parse(images);
      path = parsed[0];
    } catch (e) {
      path = images;
    }
  } else if (Array.isArray(images)) {
    path = images[0];
  } else {
    path = images;
  }

  if (!path) return "https://images.unsplash.com/photo-1599643478514-4a820c559dbf?w=800";
  if (path.startsWith("http")) return path;

  let cleanPath = path.replace(/\\/g, '/');
  if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.substring(1);
  }

  const finalPath = cleanPath.startsWith('uploads/') 
    ? cleanPath 
    : `uploads/${cleanPath}`;

  return `http://localhost:5000/${finalPath}`;
}

export default function Cart() {
  const { cart, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState("");

  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setAuthError("Please log in to proceed with your order.");
      setTimeout(() => setAuthError(""), 4000);
      return;
    }

    navigate("/checkout");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 min-h-[70vh]">
      
      {/* Header Section */}
      <header className="text-center mb-16 border-b pb-10" style={{ borderColor: '#f3ece1' }}>
        <h1 className="text-4xl font-serif italic mb-3" style={{ color: '#c2a67a' }}>
          Your Shopping Bag
        </h1>
        <p className="text-[10px] tracking-[0.3em] uppercase font-black" style={{ color: '#1a1a1a' }}>
          {cart.length} {cart.length === 1 ? 'Item' : 'Items'} Ready
        </p>
      </header>

      {cart.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center">
          <ShoppingBag size={48} strokeWidth={1} className="mb-6 opacity-30" style={{ color: '#c2a67a' }} />
          <h2 className="text-xl font-serif italic mb-4" style={{ color: '#1a1a1a' }}>
            Your bag is currently empty.
          </h2>
          <p className="text-[10px] tracking-widest uppercase font-bold mb-10" style={{ color: '#a5aebf' }}>
            Discover pieces to add to your collection.
          </p>
          <Link 
            to="/shop" 
            className="px-10 py-4 text-[10px] font-black tracking-[0.2em] uppercase transition-all shadow-md rounded-sm"
            style={{ backgroundColor: '#c2a67a', color: '#ffffff' }}
          >
            Back to shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-10">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-8 border-b pb-10 group" style={{ borderColor: '#f3ece1' }}>
                
                <Link to={`/product/${item.id}`} className="w-32 md:w-40 aspect-[4/5] bg-[#fdfbf7] border overflow-hidden relative shrink-0" style={{ borderColor: '#f3ece1' }}>
                  <img
                    src={getImageUrl(item.images || (item as any).image)}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1599643478514-4a820c559dbf?w=500";
                    }}
                  />
                </Link>

                <div className="flex-1 flex flex-col justify-between py-2">
                  <div>
                    <Link to={`/product/${item.id}`}>
                      <h3 className="text-xs font-bold tracking-widest uppercase mb-2 hover:text-[#c2a67a] transition-colors" style={{ color: '#1a1a1a' }}>
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-sm font-serif italic mt-3" style={{ color: '#c2a67a' }}>
                      ₹ {item.price ? Number(item.price).toLocaleString('en-IN') : "—"}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-[10px] uppercase font-bold tracking-widest" style={{ color: '#a5aebf' }}>
                      Qty: {item.quantity}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 hover:text-red-500 transition-colors border-none bg-transparent cursor-pointer"
                    >
                      <Trash2 size={14} strokeWidth={1.5} />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-[#fdfbf7] border p-10 h-fit rounded-sm shadow-sm" style={{ borderColor: '#f3ece1' }}>
            <h2 className="text-[11px] font-black tracking-[0.3em] uppercase mb-8" style={{ color: '#1a1a1a' }}>
              Order Summary
            </h2>
            
            <div className="flex justify-between text-xs font-bold tracking-widest uppercase mb-6" style={{ color: '#a5aebf' }}>
              <span>Subtotal</span>
              <span style={{ color: '#1a1a1a' }}>₹ {cartTotal.toLocaleString('en-IN')}</span>
            </div>
            
            <div className="flex justify-between text-xs font-bold tracking-widest uppercase mb-8 border-b pb-8" style={{ color: '#a5aebf', borderColor: '#f3ece1' }}>
              <span>Shipping</span>
              <span className="text-right">Calculated<br/>at checkout</span>
            </div>
            
            <div className="flex justify-between items-end mb-10">
              <span className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: '#1a1a1a' }}>
                Total
              </span>
              <span className="text-2xl font-serif italic" style={{ color: '#c2a67a' }}>
                ₹ {cartTotal.toLocaleString('en-IN')}
              </span>
            </div>
            
            <div className="flex flex-col gap-4">
              <button
                onClick={handleCheckout}
                className="flex items-center justify-center gap-3 w-full py-5 text-white text-[10px] font-black tracking-[0.3em] uppercase shadow-lg transition-all rounded-sm border-none cursor-pointer"
                style={{ backgroundColor: '#c2a67a' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <ShoppingBag size={16} />
                Proceed to Checkout
              </button>

              {authError && (
                <div className="text-center">
                   <p className="text-[9px] font-bold tracking-widest text-red-500 uppercase mb-2">
                    {authError}
                  </p>
                  <button 
                    onClick={() => navigate("/login")}
                    className="text-[9px] font-bold tracking-widest uppercase underline border-none bg-transparent cursor-pointer p-0 text-[#1a2238]"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}