import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import type { Product } from "../types";

// --- BULLETPROOF IMAGE HELPER ---
const getImageUrl = (images: any) => {
  let path = "";

  // 1. Handle Array, JSON string, or normal String data
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

  // 2. Fallback if no image exists
  if (!path) return "https://images.unsplash.com/photo-1599643478514-4a820c559dbf?w=800";

  // 3. If it's already a full web URL, return it
  if (path.startsWith("http")) return path;

  // 4. Clean the path
  // Fix Windows backslashes and remove any leading slashes
  let cleanPath = path.replace(/\\/g, '/');
  if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.substring(1);
  }

  // 5. Ensure "uploads/" prefix is present
  // If your DB stores just "image.jpg", this adds "uploads/image.jpg"
  const finalPath = cleanPath.startsWith('uploads/') 
    ? cleanPath 
    : `uploads/${cleanPath}`;

  // 6. Return final Render URL
  return `http://localhost:5000/${finalPath}`;
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // --- SEARCH LOGIC ---
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  // Fetch products from backend
  useEffect(() => {
    api.get("/products")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  // --- FILTER LOGIC ---
  const filteredProducts = products.filter((product) => {
    if (!searchQuery) return true;
    
    const safeName = (product.name || "").toLowerCase();
    const safeCategory = (product.category || "").toLowerCase();
    
    return safeName.includes(searchQuery) || safeCategory.includes(searchQuery);
  });

  return (
    <div className="py-24 px-8 max-w-7xl mx-auto min-h-screen">
      
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 
          className="text-4xl font-serif italic mb-4 transition-colors" 
          style={{ color: '#c2a67a' }}
        >
          {searchQuery ? "Search Results" : "The Collection"}
        </h1>
        <div className="w-12 h-[1px] bg-[#c2a67a] mx-auto mb-6"></div>
        <p className="text-[#8a94a6] tracking-[0.2em] text-[10px] uppercase font-bold">
          {searchQuery 
            ? `Showing results for "${searchQuery}" (${filteredProducts.length})` 
            : `${filteredProducts.length} ${filteredProducts.length === 1 ? "Piece" : "Pieces"} Available`}
        </p>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="text-center text-[#8a94a6] tracking-widest text-sm py-20">
          Curating collection...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-[#8a94a6] tracking-widest text-sm py-20">
          No products available yet. Add some in your Admin Panel!
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-24 flex flex-col items-center justify-center animate-fade-in">
          <svg width="48" height="48" fill="none" stroke="#c2a67a" strokeWidth="1" viewBox="0 0 24 24" className="mb-6 opacity-50">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <h3 className="text-2xl font-serif italic mb-4" style={{ color: "#1a2238" }}>
            No pieces found
          </h3>
          <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
            We couldn't find anything matching "{searchQuery}".
          </p>
          <Link 
            to="/shop"
            className="text-white text-[10px] font-bold tracking-[0.2em] px-8 py-4 uppercase hover:opacity-80 transition-opacity"
            style={{ backgroundColor: "#1a2238" }}
          >
            Clear Search
          </Link>
        </div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
          {filteredProducts.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="group cursor-pointer flex flex-col">
              <div className="aspect-[4/5] overflow-hidden bg-[#f0f0f0] mb-6 relative border border-gray-100">
                
                <img 
                  src={getImageUrl(product.images || (product as any).image)}
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1599643478514-4a820c559dbf?w=800";
                  }}
                />
                
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <span className="bg-white text-[#1a2238] text-[9px] font-bold tracking-[0.2em] px-6 py-3 uppercase shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    View Details
                  </span>
                </div>
              </div>
              
              <div className="text-center flex-1 flex flex-col justify-between mt-4">
                <div>
                  <h3 className="text-xs font-bold tracking-[0.15em] text-[#1a2238] uppercase mb-2">
                    {product.name}
                  </h3>
                  <p className="text-[10px] text-[#8a94a6] tracking-widest mb-2">
                    SKU: {product.sku || "BC-00" + product.id}
                  </p>
                  
                  <p className="text-sm font-bold tracking-widest text-[#1a2238] mb-4">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </p>
                </div>
                <p className="text-sm font-serif italic text-[#c2a67a] group-hover:text-[#1a2238] transition-colors">
                  Explore
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}