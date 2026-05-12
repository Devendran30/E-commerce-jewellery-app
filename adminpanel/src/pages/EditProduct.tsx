import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import api from "../api/axios";
import { Save} from "lucide-react";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState(""); 
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const product = location.state?.product;
    if (product && product.name) {
      setName(product.name);
      setSku(product.sku || "");
      setPrice(product.price || ""); 
      setDescription(product.description || "");
    } else {
      api.get(`/products/${id}`).then(res => {
        setName(res.data.name || "");
        setSku(res.data.sku || "");
        setPrice(res.data.price || ""); 
        setDescription(res.data.description || "");
      }).catch(console.error);
    }
  }, [id, location.state]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const existingProduct = location.state?.product || {};
      let imageUrls = existingProduct.images || [];

      // Only upload if a new file was selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const uploadRes = await api.post("/upload", formData, { 
            headers: { "Content-Type": "multipart/form-data" } 
        });
        imageUrls = [uploadRes.data.url];
      }

      await api.put(`/products/${id}`, {
        name,
        sku,
        price: Number(price),
        description,
        images: imageUrls
      });
      navigate("/products");
    } catch (err) {
      console.error(err);
      alert("Failed to update piece.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-serif italic text-[#1a2238]">Edit Piece</h1>
      </header>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 border border-gray-100 shadow-sm space-y-10">
        {/* Top Grid: Name, SKU, Price */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <label className="block text-[10px] font-bold tracking-[0.2em] text-[#1a2238] uppercase mb-4">Product Name</label>
            <input type="text" className="w-full border-b border-gray-300 pb-3 text-xs tracking-widest focus:outline-none focus:border-[#1a2238] bg-transparent" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          
          <div>
            <label className="block text-[10px] font-bold tracking-[0.2em] text-[#1a2238] uppercase mb-4">SKU</label>
            <input type="text" className="w-full border-b border-gray-300 pb-3 text-xs tracking-widest focus:outline-none focus:border-[#1a2238] bg-transparent" value={sku} onChange={e => setSku(e.target.value)} required />
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-[0.2em] text-[#1a2238] uppercase mb-4">Price (₹)</label>
            <input type="number" min="0" className="w-full border-b border-gray-300 pb-3 text-xs tracking-widest focus:outline-none focus:border-[#1a2238] bg-transparent" value={price} onChange={e => setPrice(e.target.value)} required />
          </div>
        </div>

        {/* Image Upload Section */}
        <div>
          <label className="block text-[10px] font-bold tracking-[0.2em] text-[#1a2238] uppercase mb-4">
            Update Product Image
          </label>
          <div className="relative">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageChange} 
              className="w-full border-b border-gray-300 pb-3 text-xs tracking-widest focus:outline-none focus:border-[#1a2238] bg-transparent file:mr-4 file:py-1 file:px-4 file:rounded-sm file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-[#1a2238] file:text-white hover:file:bg-[#c2a67a] cursor-pointer"
            />
            {imageFile && (
              <p className="mt-2 text-[10px] text-green-600 font-bold uppercase tracking-widest">
                New file ready: {imageFile.name}
              </p>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div>
          <label className="block text-[10px] font-bold tracking-[0.2em] text-[#1a2238] uppercase mb-4">Description</label>
          <textarea 
            className="w-full border border-gray-200 p-4 text-xs tracking-wide focus:outline-none focus:border-[#1a2238] bg-[#f9fafb]" 
            rows={4} 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
          />
        </div>

        {/* Submit Button */}
        <button 
          disabled={loading} 
          type="submit" 
          className="w-full flex items-center justify-center gap-3 bg-[#1a2238] text-white py-5 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#c2a67a] transition-colors disabled:opacity-60"
        >
          {loading ? "Updating..." : <><Save size={16} /> Update Details</>}
        </button>
      </form>
    </div>
  );
}