import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { UploadCloud, Save } from "lucide-react";

export default function AddProduct() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrls: string[] = [];

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        
        const uploadRes = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        imageUrls.push(uploadRes.data.url);
      }

      await api.post("/products", {
        name,
        sku,
        description,
        price: Number(price), 
        images: imageUrls,
        variations: [{ price: Number(price), stock: 10 }] 
      });

      alert("Product added successfully!");
      navigate("/products");
    } catch (err) {
      console.error(err);
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  // Helper for input styling (Keeps code clean and consistent)
  const inputStyle = {
    borderBottom: '2px solid #e5e7eb',
    color: '#1a1a1a',
    backgroundColor: 'transparent',
    outline: 'none',
    width: '100%',
    paddingBottom: '12px',
    fontSize: '12px',
    letterSpacing: '0.1em',
    transition: 'all 0.3s',
    fontWeight: '500'
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderBottomColor = '#c2a67a';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderBottomColor = '#e5e7eb';
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-serif italic mb-2" style={{ color: '#c2a67a' }}>
          Add New Piece
        </h1>
        <p className="text-[10px] tracking-[0.3em] uppercase font-black mt-2" style={{ color: '#1a1a1a' }}>
          Expand The Collection
        </p>
      </header>
      
      <form onSubmit={handleSubmit} className="bg-white p-12 border-none rounded-xl shadow-xl space-y-12">
        
        {/* Name & SKU Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <label className="block text-[10px] font-black tracking-[0.2em] uppercase mb-4" style={{ color: '#c2a67a' }}>
              Product Name
            </label>
            <input 
              type="text" 
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="e.g., Rose Gold Emerald Ring"
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-black tracking-[0.2em] uppercase mb-4" style={{ color: '#c2a67a' }}>
              SKU (Stock Keeping Unit)
            </label>
            <input 
              type="text" 
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="e.g., RGER-001"
              value={sku} 
              onChange={e => setSku(e.target.value)} 
              required 
            />
          </div>
        </div>

        {/* Price Row */}
        <div className="w-full md:w-1/2 md:pr-6">
          <label className="block text-[10px] font-black tracking-[0.2em] uppercase mb-4" style={{ color: '#c2a67a' }}>
            Investment Price (₹)
          </label>
          <input 
            type="number" 
            style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '14px' }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="0.00"
            min="0"
            step="0.01"
            value={price} 
            onChange={e => setPrice(e.target.value)} 
            required 
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-[10px] font-black tracking-[0.2em] uppercase mb-4" style={{ color: '#c2a67a' }}>
            Description & Craftsmanship
          </label>
          <textarea 
            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            rows={3} 
            placeholder="Describe the craftsmanship, materials, and inspiration..."
            value={description} 
            onChange={e => setDescription(e.target.value)} 
          />
        </div>

        {/* Custom Image Upload Box */}
        <div>
          <label className="block text-[10px] font-black tracking-[0.2em] uppercase mb-4" style={{ color: '#c2a67a' }}>
            Product Imagery
          </label>
          <div 
            className="relative border-2 border-dashed transition-all p-12 flex flex-col items-center justify-center text-center cursor-pointer rounded-lg"
            style={{ borderColor: '#e5e7eb', backgroundColor: '#fdfbf7' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#c2a67a'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
          >
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              onChange={handleImageChange} 
            />
            <UploadCloud size={36} className="mb-4 transition-transform hover:scale-110" style={{ color: '#c2a67a' }} strokeWidth={1.5} />
            <p className="text-xs font-black tracking-widest uppercase mb-2" style={{ color: '#1a1a1a' }}>
              {imageFile ? imageFile.name : "Click to Upload Master Image"}
            </p>
            <p className="text-[10px] tracking-widest uppercase font-bold" style={{ color: '#a5aebf' }}>
              {imageFile ? "Image ready for upload" : "High-resolution JPEG or PNG"}
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          disabled={loading} 
          type="submit" 
          className="w-full py-6 rounded font-black text-[11px] tracking-[0.3em] uppercase transition-all shadow-lg flex items-center justify-center gap-3"
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
              <Save size={18} />
              Commit to Collection
            </>
          )}
        </button>
      </form>
    </div>
  );
}