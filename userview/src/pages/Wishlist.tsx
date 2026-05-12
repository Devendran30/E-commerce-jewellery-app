import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Trash2, ShoppingBag, Heart } from "lucide-react";

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

  
};

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  // NEW: State to track which item shows the login prompt
  const [authPrompt, setAuthPrompt] = useState<{ id: string | number, message: string } | null>(null);
  
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlistItems(savedWishlist);
  }, []);

  const removeItem = (id: number | string) => {
    const updatedList = wishlistItems.filter((item) => item.id !== id);
    setWishlistItems(updatedList);
    localStorage.setItem("wishlist", JSON.stringify(updatedList));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const moveToCart = (item: any) => {
    // SECURITY CHECK: Is user logged in?
    const isCustomerLoggedIn = localStorage.getItem("token");

    if (!isCustomerLoggedIn) {
      // Show message for this specific item
      setAuthPrompt({ id: item.id, message: "Please log in to move to bag" });
      setTimeout(() => setAuthPrompt(null), 4000); 
      return; 
    }

    // Proceed if logged in
    addToCart(item, 1);
    removeItem(item.id); 
    setAuthPrompt(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 min-h-[70vh]">
      
      {/* Header Section */}
      <header className="text-center mb-16 border-b pb-10" style={{ borderColor: '#f3ece1' }}>
        <h1 className="text-4xl font-serif italic mb-3" style={{ color: '#c2a67a' }}>
          Your Private Collection
        </h1>
        <p className="text-[10px] tracking-[0.3em] uppercase font-black" style={{ color: '#1a1a1a' }}>
          Curated Masterpieces ({wishlistItems.length})
        </p>
      </header>

      {/* Empty State */}
      {wishlistItems.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center">
          <Heart size={48} strokeWidth={1} className="mb-6 opacity-30" style={{ color: '#c2a67a' }} />
          <h2 className="text-xl font-serif italic mb-4" style={{ color: '#1a1a1a' }}>
            Your collection is currently empty.
          </h2>
          <p className="text-[10px] tracking-widest uppercase font-bold mb-10" style={{ color: '#a5aebf' }}>
            Discover pieces that speak to you and save them here.
          </p>
          <Link 
            to="/shop" 
            className="px-10 py-4 text-[10px] font-black tracking-[0.2em] uppercase transition-all shadow-md rounded-sm"
            style={{ backgroundColor: '#c2a67a', color: '#ffffff' }}
          >
            Explore The Gallery
          </Link>
        </div>
      ) : (
        /* Wishlist Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {wishlistItems.map((item) => (
            <div key={item.id} className="group flex flex-col">
              
              {/* Image Container */}
              <div className="aspect-[4/5] w-full bg-[#fdfbf7] relative overflow-hidden mb-6 flex items-center justify-center border" style={{ borderColor: '#f3ece1' }}>
                <Link to={`/product/${item.id}`} className="w-full h-full block">
                  <img 
                    src={getImageUrl(item.images || item.image)} 
                    alt={item.name} 
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1599643478514-4a820c559dbf?w=500";
                    }}
                  />
                </Link>
                
                <button 
                  onClick={() => removeItem(item.id)}
                  className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white text-gray-400 hover:text-red-500 shadow-sm"
                >
                  <Trash2 size={16} strokeWidth={1.5} />
                </button>
              </div>

              {/* Product Details */}
              <div className="text-center flex-1 flex flex-col">
                <h3 className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#1a1a1a' }}>
                  {item.name}
                </h3>
                <p className="text-sm font-serif italic mb-6" style={{ color: '#c2a67a' }}>
                  ₹ {item.price ? Number(item.price).toLocaleString('en-IN') : "0"}
                </p>
                
                {/* Move to Bag Button Area */}
                {/* Move to Bag Button Area */}
<div className="mt-auto">
  <button 
    onClick={() => moveToCart(item)}
    className="w-full py-4 border text-[10px] font-black tracking-[0.2em] uppercase flex items-center justify-center gap-3 transition-all cursor-pointer"
    style={{ 
      borderColor: '#c2a67a', 
      color: '#c2a67a',
      backgroundColor: 'transparent'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = '#c2a67a';
      e.currentTarget.style.color = '#ffffff';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = 'transparent';
      e.currentTarget.style.color = '#c2a67a';
    }}
  >
    <ShoppingBag size={14} />
    Move to Bag
  </button>

  {/* FIXED LOGIC FOR LINE 168 */}
  {authPrompt && authPrompt.id === item.id && (
    <div className="mt-3 flex flex-col items-center gap-1 text-[9px] font-bold tracking-widest uppercase text-red-500">
      <span>{authPrompt.message}</span>
      <button 
        type="button"
        onClick={() => navigate("/login")}
        className="underline text-[#1a2238] border-none bg-transparent cursor-pointer p-0 font-bold"
      >
        Sign In
      </button>
    </div>
  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}