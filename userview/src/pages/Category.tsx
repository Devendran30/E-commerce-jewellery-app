import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import type { Product } from "../types";

export default function Category() {
  const { name } = useParams(); // Gets 'rings', 'necklaces', etc. from the URL
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Capitalize the first letter for the title
  const formattedCategoryName = name ? name.charAt(0).toUpperCase() + name.slice(1) : "";

  useEffect(() => {
    // In a real app, you'd fetch only products matching this category:
    // api.get(`/products?category=${name}`)
    
    // For now, we'll just fetch all products to show the UI working
    api.get("/products")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching category products:", err);
        setLoading(false);
      });
  }, [name]);

  return (
    <div className="py-24 px-8 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-serif italic text-[#1a2238] mb-4">{formattedCategoryName}</h1>
        <div className="w-12 h-[1px] bg-[#c2a67a] mx-auto mb-6"></div>
        <p className="text-[#8a94a6] tracking-[0.2em] text-[10px] uppercase font-bold">
          {products.length} {products.length === 1 ? 'Piece' : 'Pieces'} Available
        </p>
      </div>

      {loading ? (
        <div className="text-center text-[#8a94a6] tracking-widest text-sm py-20">
          Curating {formattedCategoryName}...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-[#8a94a6] tracking-widest text-sm py-20">
          No pieces available in this collection yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="group cursor-pointer flex flex-col">
              {/* Image Container */}
              <div className="aspect-[4/5] overflow-hidden bg-[#f0f0f0] mb-6 relative">
                <img 
                  src={product.images && product.images.length > 0 ? product.images[0] : "https://images.unsplash.com/photo-1599643478514-4a820c559dbf?w=500"} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <span className="bg-white text-[#1a2238] text-[9px] font-bold tracking-[0.2em] px-6 py-3 uppercase shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    View Details
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="text-center flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold tracking-[0.15em] text-[#1a2238] uppercase mb-2">
                    {product.name}
                  </h3>
                  <p className="text-[10px] text-[#8a94a6] tracking-widest mb-3">
                    SKU: {product.sku}
                  </p>
                </div>
                <p className="text-sm font-serif italic text-[#c2a67a]">
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