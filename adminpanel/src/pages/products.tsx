import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { Plus, Trash2, Edit2, PackageOpen } from "lucide-react";
import type { product } from "../types"; 

export default function Products() {
  const [products, setProducts] = useState<product[]>([]);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data)).catch(console.error);
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to permanently remove this piece from the collection?")) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        console.error("Failed to delete", err);
        alert("Failed to delete product.");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b pb-6" style={{ borderColor: '#f3ece1' }}>
        <div>
          <h1 className="text-4xl font-serif italic mb-2" style={{ color: '#c2a67a' }}>The Collection</h1>
          <p className="text-[10px] tracking-[0.3em] uppercase font-black" style={{ color: '#1a1a1a' }}>Inventory Management</p>
        </div>
        
        <Link 
          to="/add-product" 
          className="flex items-center gap-3 px-8 py-4 text-[10px] font-black tracking-[0.2em] uppercase transition-all shadow-lg w-fit rounded-sm"
          style={{ backgroundColor: '#c2a67a', color: '#ffffff' }}
        >
          <Plus size={18} strokeWidth={2} /> Add Piece
        </Link>
      </header>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl p-24 flex flex-col items-center justify-center text-center shadow-xl" style={{ border: '1px solid #f3ece1' }}>
          <PackageOpen size={56} className="mb-6" style={{ color: '#c2a67a' }} strokeWidth={1} />
          <h2 className="text-[11px] font-black tracking-[0.3em] uppercase mb-3" style={{ color: '#1a1a1a' }}>Inventory is Empty</h2>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-xl overflow-x-auto" style={{ border: '1px solid #f3ece1' }}>
          <table className="min-w-full text-left border-collapse">
            <thead style={{ backgroundColor: '#fdfbf7', borderBottom: '1px solid #f3ece1' }}>
              <tr>
                <th className="p-6 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#a5aebf' }}>Reference ID</th>
                <th className="p-6 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#a5aebf' }}>Piece</th>
                <th className="p-6 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#a5aebf' }}>SKU</th>
                {/* ⚡ HERE IS THE PRICE HEADER ⚡ */}
                <th className="p-6 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#a5aebf' }}>Price</th>
                <th className="p-6 text-[10px] font-black tracking-[0.2em] uppercase text-right" style={{ color: '#a5aebf' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-[#fafafa] transition-colors group" style={{ borderBottom: '1px solid #f3ece1' }}>
                  <td className="p-6 text-xs font-black tracking-wider" style={{ color: '#1a1a1a' }}>#{String(product.id).padStart(4, '0')}</td>
                  <td className="p-6"><span className="text-xs tracking-widest uppercase font-bold" style={{ color: '#1a1a1a' }}>{product.name}</span></td>
                  <td className="p-6 text-[10px] tracking-widest font-bold uppercase" style={{ color: '#a5aebf' }}>{product.sku}</td>
                  
                  {/* ⚡ HERE IS THE PRICE DATA DATA CELL ⚡ */}
                  <td className="p-6 text-[11px] tracking-wider font-bold" style={{ color: '#1a1a1a' }}>
                    ₹{Number((product as any).price || 0).toLocaleString('en-IN')}
                  </td>
                  
                  <td className="p-6 flex justify-end items-center gap-6 opacity-70 group-hover:opacity-100 transition-opacity">
                    <Link to={`/edit-product/${product.id}`} state={{ product }} className="p-2 flex items-center transition-colors" style={{ color: '#1a1a1a' }}>
                      <Edit2 size={18} strokeWidth={1.5} />
                    </Link>
                    <button onClick={() => handleDelete(product.id)} className="p-2 flex items-center transition-colors" style={{ color: '#ef4444' }}>
                      <Trash2 size={18} strokeWidth={1.5} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}