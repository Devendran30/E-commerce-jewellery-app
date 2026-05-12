import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import type { Product } from "../types";
import { useCart } from "../context/CartContext";

// The full URL to your Render backend uploads folder
const IMAGE_BASE_URL = "https://devatesting.rakvihorganic.com/uploads/";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const [authPrompt, setAuthPrompt] = useState<{ type: 'cart' | 'wishlist', message: string } | null>(null);

  const { addToCart } = useCart();

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);

        const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        if (savedWishlist.some((item: any) => item.id === res.data.id)) {
          setIsWishlisted(true);
        }
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setLoading(false);
      });
  }, [id]);

  // Helper to determine the correct image source
  const getImageSource = () => {
    if (!product) return "https://images.unsplash.com/photo-1599643478514-4a820c559dbf?w=800";
    
    // Check if using 'images' array or single 'image' field
    const imgPath = (product.images && product.images.length > 0) ? product.images[0] : (product as any).image;
    
    if (!imgPath) return "https://images.unsplash.com/photo-1599643478514-4a820c559dbf?w=800";
    
    // If it's already a full URL, return it; otherwise, append the Render base URL
    return imgPath.startsWith('http') ? imgPath : `${IMAGE_BASE_URL}${imgPath}`;
  };

  const toggleWishlist = () => {
    if (!product) return;

    const isCustomerLoggedIn = localStorage.getItem("token");
    if (!isCustomerLoggedIn) {
      setAuthPrompt({ type: 'wishlist', message: "Please log in to curate your wishlist." });
      setTimeout(() => setAuthPrompt(null), 4000);
      return; 
    }

    let savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

    if (isWishlisted) {
      savedWishlist = savedWishlist.filter((item: any) => item.id !== product.id);
      setIsWishlisted(false);
    } else {
      savedWishlist.push(product);
      setIsWishlisted(true);
    }

    localStorage.setItem('wishlist', JSON.stringify(savedWishlist));
    window.dispatchEvent(new Event("wishlistUpdated"));
    setAuthPrompt(null);
  };

  const handleAddToCart = () => {
    if (!product) return; 

    const isCustomerLoggedIn = localStorage.getItem("token");
    if (!isCustomerLoggedIn) {
      setAuthPrompt({ type: 'cart', message: "Please log in to add pieces to your cart." });
      setTimeout(() => setAuthPrompt(null), 4000);
      return; 
    }

    addToCart(product, quantity);
    setAuthPrompt(null);
  };

  if (loading) return (
    <div className="py-32 text-center tracking-widest text-sm" style={{ color: '#a5aebf' }}>
      RETRIEVING PIECE...
    </div>
  );
  
  if (!product) return (
    <div className="py-32 text-center tracking-widest text-sm" style={{ color: '#a5aebf' }}>
      PRODUCT NOT FOUND.
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-16 min-h-[80vh]">
      
      {/* Left: Image Gallery */}
      <div className="bg-[#f7f7f7] aspect-[4/5] relative overflow-hidden rounded-sm border border-gray-100">
        <img 
          src={getImageSource()} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1599643478514-4a820c559dbf?w=800";
          }}
        />
      </div>

      {/* Right: Product Info */}
      <div className="flex flex-col justify-center">
        <div className="mb-2 text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: '#a5aebf' }}>
          Bangalore Collective
        </div>

        <h1 className="text-4xl font-serif italic mb-4" style={{ color: '#c2a67a', margin: '0 0 1rem 0' }}>
          {product.name}
        </h1>

        <p className="text-[10px] tracking-[0.2em] mb-8 uppercase font-bold" style={{ color: '#a5aebf' }}>
          SKU: {product.sku || 'BC-00' + product.id}
        </p>
        
        <div className="text-3xl font-serif mb-8" style={{ color: '#c2a67a' }}>
          ₹ {product.price ? product.price.toLocaleString() : "0"}
        </div>

        <div className="w-full h-[1px] bg-gray-100 mb-8"></div>

        <p className="text-sm leading-relaxed mb-10" style={{ color: '#666666' }}>
          {product.description || "An exquisite piece crafted with precision. This item defines the new standard of elegance, designed specifically for the Bangalore Collective."}
        </p>

        {/* Add to Cart Controls Group */}
        <div className="mb-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center border" style={{ borderColor: '#c2a67a' }}>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                className="px-5 py-3 transition-colors hover:bg-gray-50 border-none bg-transparent cursor-pointer"
                style={{ color: '#c2a67a' }}
              >
                -
              </button>
              <span className="px-4 text-sm font-bold" style={{ color: '#c2a67a' }}>
                {quantity}
              </span>
              <button 
                onClick={() => setQuantity(quantity + 1)} 
                className="px-5 py-3 transition-colors hover:bg-gray-50 border-none bg-transparent cursor-pointer"
                style={{ color: '#c2a67a' }}
              >
                +
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              style={{ 
                backgroundColor: '#c2a67a', 
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 'bold',
                letterSpacing: '0.2em',
                padding: '17px 0',
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
                flex: 1
              }}
              className="transition-opacity hover:opacity-90"
            >
              Add to Cart
            </button>
          </div>
          
          {authPrompt?.type === 'cart' && (
            <div className="mt-3 flex items-center gap-2 text-[9px] font-bold tracking-[0.15em] uppercase text-red-500 transition-all duration-300">
              <span>{authPrompt.message}</span>
              <button 
                onClick={() => navigate("/login")}
                className="underline border-none bg-transparent cursor-pointer p-0 text-[#c2a67a] hover:text-[#1a2238]"
              >
                Sign In
              </button>
            </div>
          )}
        </div>

        {/* Wishlist Toggle Group */}
        <div>
          <button 
            onClick={toggleWishlist}
            className="flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] uppercase w-fit transition-all"
            style={{ 
              color: isWishlisted ? '#c2a67a' : '#a5aebf',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <span style={{ fontSize: '18px' }}>{isWishlisted ? "♥" : "♡"}</span> 
            {isWishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
          </button>

          {authPrompt?.type === 'wishlist' && (
            <div className="mt-3 flex items-center gap-2 text-[9px] font-bold tracking-[0.15em] uppercase text-red-500 transition-all duration-300">
              <span>{authPrompt.message}</span>
              <button 
                onClick={() => navigate("/login")}
                className="underline border-none bg-transparent cursor-pointer p-0 text-[#c2a67a] hover:text-[#1a2238]"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}