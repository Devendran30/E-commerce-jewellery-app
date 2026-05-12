import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { 
  Layout, Plus, Trash2, Save, Image as ImageIcon, Link as LinkIcon, 
  Instagram, X, Edit3, Upload, Megaphone, Type, AlignLeft, Link2, Grid, Sparkles 
} from "lucide-react";

type Tab = "instagram" | "promo";

const getImageUrl = (images: any) => {
  if (!images) return "";
  
  let path = "";
  if (typeof images === 'string' && images.startsWith('[')) {
    try { path = JSON.parse(images)[0]; } catch (e) { path = images; }
  } else if (Array.isArray(images)) {
    path = images[0];
  } else {
    path = images;
  }

  if (!path) return "";
  const cleanUrl = path.trim();
  if (cleanUrl.startsWith("http")) return cleanUrl; 

  const filename = cleanUrl.split(/[/\\]/).pop(); 
  return `https://devatesting.rakvihorganic.com/uploads/${filename}`;
};

export default function HomeManager() {
  const [activeTab, setActiveTab] = useState<Tab>("instagram");
  const [loading, setLoading] = useState(false);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [instaConfig, setInstaConfig] = useState({ links: [] as string[], isActive: true });
  const [newLink, setNewLink] = useState("");
  const [promoCards, setPromoCards] = useState<any[]>([]);
  
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  useEffect(() => {
    api.get("/home-settings").then((res) => {
      setInstaConfig({
        links: res.data.insta?.links || [],
        isActive: res.data.insta?.isActive ?? true
      });
      setPromoCards(res.data.cards ?? []);
    }).catch(console.error);
  }, []);

  const addInstaLink = () => {
    const link = newLink.trim();
    if (!link || (!link.includes("instagram.com/p/") && !link.includes("instagram.com/reel/"))) return;
    const cleanLink = link.split('?')[0];
    setInstaConfig({ ...instaConfig, links: [cleanLink, ...instaConfig.links] });
    setNewLink("");
  };

  const addCard = () => {
    setPromoCards([...promoCards, { id: Date.now(), title: "", subtitle: "", link: "", image: "" }]);
  };

  const handleImageUpload = async (cardId: number, file: File) => {
    if (!file) return;
    
    setUploadingId(cardId);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      const updatedCards = promoCards.map(card => {
        if (card.id === cardId) {
          return { ...card, image: res.data.url }; 
        }
        return card;
      });
      setPromoCards(updatedCards);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image.");
    } finally {
      setUploadingId(null);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.post("/home-settings/update", { insta: instaConfig, cards: promoCards });
      alert("Storefront updated successfully!");
    } catch (err: any) {
      alert("Update failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-10 pb-32">
      
      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-200 pb-8 gap-6 bg-white/50 p-8 rounded-3xl shadow-sm backdrop-blur-md">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-[#fdfbf7] rounded-xl border border-[#f3ece1] shadow-sm">
              <Layout style={{ color: "#c2a67a" }} size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-serif italic tracking-tight" style={{ color: "#1a2238" }}>Storefront Manager</h1>
              <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#c2a67a] mt-1">Admin Creations</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-3 px-8 py-4 text-[11px] font-bold tracking-[0.2em] uppercase rounded-xl shadow-md text-white transition-all hover:shadow-lg hover:-translate-y-0.5"
          style={{ backgroundColor: "#1a2238" }}
        >
          {loading ? (
            <span className="flex items-center gap-2"><Sparkles className="animate-pulse" size={16}/> Publishing...</span>
          ) : (
            <><Save size={16} /> Publish Changes</>
          )}
        </button>
      </header>

      {/* --- TABS --- */}
      <div className="flex p-2 bg-white border border-gray-200 rounded-xl w-fit shadow-sm">
        {["instagram", "promo"].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as Tab)} 
            className={`flex items-center px-8 py-3 rounded-lg text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${activeTab === tab ? 'bg-[#fdfbf7] text-[#c2a67a] shadow-sm border border-[#f3ece1]' : 'text-gray-400 hover:text-gray-800 hover:bg-gray-50'}`}
          >
            {tab === "instagram" ? <Instagram className="inline mr-2.5" size={16} /> : <Megaphone className="inline mr-2.5" size={16} />}
            {tab === "instagram" ? "Instagram Feed" : "Promo Cards"}
          </button>
        ))}
      </div>

      {/* --- PROMO CARDS SECTION --- */}
      {activeTab === "promo" && (
        <section className="space-y-8 animate-fade-in">
           <div className="flex flex-col md:flex-row md:items-center justify-between bg-gradient-to-r from-white to-[#fdfbf7] p-8 rounded-3xl border border-[#f3ece1] shadow-sm gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white rounded-full shadow-sm border border-gray-100">
                  <Megaphone size={24} style={{ color: "#c2a67a" }} />
                </div>
                <div>
                  <h2 className="text-2xl font-serif italic" style={{ color: "#1a2238" }}>Promotional Banners</h2>
                  <p className="text-xs text-gray-500 mt-1">Design the eye-catching cards that appear on your homepage.</p>
                </div>
              </div>
              <button onClick={addCard} className="flex items-center gap-2 px-8 py-4 rounded-xl text-[11px] font-bold tracking-widest uppercase bg-white border border-[#c2a67a] text-[#c2a67a] hover:bg-[#c2a67a] hover:text-white transition-all shadow-sm">
                <Plus size={16} /> Add New Banner
              </button>
          </div>

          <div className="grid grid-cols-1 gap-10">
            {promoCards.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center">
                <Edit3 size={48} className="text-gray-200 mb-4" />
                <p className="text-gray-400 text-sm font-medium">No promotional banners created yet.</p>
                <button onClick={addCard} className="mt-4 text-[#c2a67a] text-xs font-bold uppercase tracking-widest hover:underline">Create your first banner</button>
              </div>
            )}

            {promoCards.map((card, index) => (
              <div key={card.id} className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 relative group overflow-hidden transition-all hover:shadow-md">
                <button onClick={() => setPromoCards(promoCards.filter(c => c.id !== card.id))} className="absolute top-8 right-8 p-3 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-full transition-all z-20 shadow-sm opacity-0 group-hover:opacity-100">
                  <Trash2 size={16} />
                </button>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                      <div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-black shadow-inner" style={{ backgroundColor: "#1a2238" }}>
                        {index + 1}
                      </div>
                      <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400">Card Configuration</h3>
                    </div>

                    {/* Headline Input */}
                    <div className="relative">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Headline</label>
                      <div className="relative flex items-center">
                        <Type size={16} className="absolute left-4 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="e.g. Summer Collection"
                          className="w-full bg-[#f9f9f9] border border-gray-200 rounded-xl pl-12 pr-4 py-4 text-sm focus:border-[#c2a67a] focus:bg-white focus:ring-4 focus:ring-[#c2a67a]/10 outline-none transition-all" 
                          value={card.title} 
                          onChange={(e) => { 
                            const n = [...promoCards]; 
                            n[index].title = e.target.value; 
                            setPromoCards(n); 
                          }} 
                        />
                      </div>
                    </div>

                    {/* Subtext Input */}
                    <div className="relative">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Subtext</label>
                      <div className="relative flex items-center">
                        <AlignLeft size={16} className="absolute left-4 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="e.g. Discover the latest arrivals"
                          className="w-full bg-[#f9f9f9] border border-gray-200 rounded-xl pl-12 pr-4 py-4 text-sm focus:border-[#c2a67a] focus:bg-white focus:ring-4 focus:ring-[#c2a67a]/10 outline-none transition-all" 
                          value={card.subtitle} 
                          onChange={(e) => { 
                            const n = [...promoCards]; 
                            n[index].subtitle = e.target.value; 
                            setPromoCards(n); 
                          }} 
                        />
                      </div>
                    </div>

                    {/* Button Link Input */}
                    <div className="relative">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Button Link Destination</label>
                      <div className="relative flex items-center">
                        <LinkIcon size={16} className="absolute left-4 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="e.g. /shop/summer"
                          className="w-full bg-[#f9f9f9] border border-gray-200 rounded-xl pl-12 pr-4 py-4 text-sm focus:border-[#c2a67a] focus:bg-white focus:ring-4 focus:ring-[#c2a67a]/10 outline-none transition-all" 
                          value={card.link} 
                          onChange={(e) => { 
                            const n = [...promoCards]; 
                            n[index].link = e.target.value; 
                            setPromoCards(n); 
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Image Preview Area */}
                  <div className="flex flex-col h-full pt-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Banner Visual</label>
                    <div className="relative w-full h-[320px] rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 bg-[#f9f9f9] flex flex-col justify-end group/imgbox transition-all hover:border-[#c2a67a]/50">
                      
                      {card.image ? (
                        <img 
                          src={getImageUrl(card.image)} 
                          alt="Preview" 
                          crossOrigin="anonymous" 
                          className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover/imgbox:scale-105"
                          style={{ display: 'block' }}
                          onError={(e) => {
                            e.currentTarget.src = "https://placehold.co/600x400?text=Invalid+Image+URL";
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 bg-gray-50/50">
                          <ImageIcon size={48} strokeWidth={1} className="mb-3 text-gray-400" />
                          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">No Visual Uploaded</p>
                          <p className="text-xs text-gray-400 mt-2">Click upload or paste a link below</p>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/imgbox:opacity-100 transition-all duration-300 flex items-center justify-center z-10 backdrop-blur-[2px]">
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden" 
                          ref={(el) => { fileInputRefs.current[card.id] = el; }}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleImageUpload(card.id, e.target.files[0]);
                            }
                          }}
                        />
                        <button 
                          onClick={() => fileInputRefs.current[card.id]?.click()}
                          disabled={uploadingId === card.id}
                          className="bg-white text-[#1a2238] px-8 py-4 rounded-full text-[11px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-[#c2a67a] hover:text-white hover:scale-105 transition-all shadow-xl"
                        >
                          {uploadingId === card.id ? "Uploading..." : <><Upload size={16} /> Upload Image</>}
                        </button>
                      </div>

                      <div className="relative z-20 p-5 w-full bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center gap-2 mb-3">
                          <Link2 size={14} className="text-[#c2a67a]" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Or Paste Image URL</span>
                        </div>
                        <input 
                          type="text" 
                          placeholder="https://unsplash.com/..." 
                          className="w-full text-sm font-medium focus:outline-none bg-transparent border-b-2 border-gray-100 focus:border-[#c2a67a] pb-2 transition-colors text-gray-700" 
                          value={card.image} 
                          onChange={(e) => { 
                            const n = [...promoCards]; 
                            n[index].image = e.target.value; 
                            setPromoCards(n); 
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- INSTAGRAM SECTION --- */}
      {activeTab === "instagram" && (
        <section className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm animate-fade-in relative overflow-hidden">
          
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-pink-100/40 via-purple-100/20 to-transparent rounded-bl-full -z-10 pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-2xl shadow-md text-white">
                <Instagram size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-serif italic" style={{ color: "#1a2238" }}>Curate Instagram Feed</h2>
                <p className="text-xs text-gray-500 mt-1">Connect your reels and posts directly to the homepage carousel.</p>
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-xl border border-gray-100 shadow-inner">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Widget Status</span>
              <button
                  onClick={() => setInstaConfig({ ...instaConfig, isActive: !instaConfig.isActive })}
                  className="relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#c2a67a] focus:ring-offset-2"
                  style={{ backgroundColor: instaConfig.isActive ? "#c2a67a" : "#cbd5e1" }}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${instaConfig.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          {/* Input Box */}
          <div className="flex flex-col md:flex-row gap-4 mb-12 bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <div className="flex-1 relative flex items-center">
              <Link2 size={18} className="absolute left-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Paste Instagram Post or Reel URL here..." 
                className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-4 text-sm focus:border-[#c2a67a] focus:ring-4 focus:ring-[#c2a67a]/10 outline-none shadow-sm transition-all" 
                value={newLink} 
                onChange={(e) => setNewLink(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && addInstaLink()}
              />
            </div>
            <button 
              onClick={addInstaLink} 
              className="px-10 py-4 text-white text-[11px] font-bold tracking-widest uppercase rounded-xl hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2"
              style={{ backgroundColor: "#1a2238" }}
            >
              <Plus size={16}/> Add Link
            </button>
          </div>

          {/* Link List */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-100">
              <Grid size={16} className="text-gray-400" />
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500">Connected Media ({instaConfig.links.length})</h3>
            </div>

            {instaConfig.links.length === 0 ? (
              <div className="py-16 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <Instagram size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-400 text-sm font-medium">No Instagram links added yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {instaConfig.links.map((link, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-[#c2a67a]/30 transition-all group">
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="p-2 bg-pink-50 text-pink-500 rounded-lg shrink-0">
                        <Instagram size={18} />
                      </div>
                      <span className="text-sm text-gray-600 font-medium truncate">{link}</span>
                    </div>
                    <button 
                      onClick={() => {
                        const updated = instaConfig.links.filter((_, idx) => idx !== i);
                        setInstaConfig({...instaConfig, links: updated});
                      }} 
                      className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all shrink-0 ml-4"
                    >
                      <X size={18}/>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}