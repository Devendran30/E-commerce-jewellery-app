import { useState, useEffect } from "react"; 
import { Link } from "react-router-dom"; 
import { ArrowRight, Instagram, Truck, Wallet, ShieldCheck, Headphones } from "lucide-react"; 
import api from "../api/axios"; 

// --- UPDATED BULLETPROOF IMAGE HELPER (Hostinger Ready) ---
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

  // Return Unsplash/external links immediately
  if (cleanUrl.startsWith("http")) return cleanUrl; 

  // Strip away "backend/uploads" or "uploads/" and just get the file name
  const finalPath = cleanUrl.split(/[/\\]/).pop(); 
  
  // Directly targets your Hostinger uploads folder!
  return `https://devatesting.rakvihorganic.com/uploads/${finalPath}`;
};

export default function Home() { 
  const [promoCards, setPromoCards] = useState<any[]>([]); 
  const [instaConfig, setInstaConfig] = useState({ links: [] as string[], isActive: false }); 

  useEffect(() => { 
    api.get("/home-settings") 
      .then((res) => { 
        if (res.data.cards) setPromoCards(res.data.cards); 
        if (res.data.insta) setInstaConfig(res.data.insta); 
      }) 
      .catch((err) => console.error("Failed to load storefront settings:", err)); 
  }, []); 

  const collections = [ 
    { 
      id: 1, 
      tag: "SALE!", 
      title: "Love Inspires", 
      image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=500", 
      linkText: "Explore Collection", 
      linkTo: "/shop" 
    }, 
    { 
      id: 2, 
      tag: "PENDANTS", 
      title: "Classic Hits", 
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=500&auto=format&fit=crop", 
      linkText: "Explore Collection", 
      linkTo: "/shop" 
    }, 
    { 
      id: 3, 
      tag: "DISCOVER!", 
      title: "New Arrival", 
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500", 
      linkText: "Explore Collection", 
      linkTo: "/shop", 
      hasFloatingButton: true, 
    } 
  ]; 

  const featuredDetails = [ 
    { 
      id: "01", 
      title: "Sapphire Crystal", 
      description: "Symbol of wisdom and royalty — the Sapphire Crystal radiates deep celestial blue. Believed to bring protection and clarity.", 
      image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=500" 
    }, 
    { 
      id: "02", 
      title: "Silver Ring", 
      description: "Classic yet contemporary, the Silver Ring embodies purity and balance. Its cool sheen enhances any gemstone it embraces.", 
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=500&auto=format&fit=crop" 
    }, 
    { 
      id: "03", 
      title: "Gem Layer", 
      description: "A masterful arrangement of precious stones, creating a symphony of light and color that captures the eye instantly.", 
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500" 
    }, 
    { 
      id: "04", 
      title: "Rose Quartz", 
      description: "The stone of universal love. Restores trust and harmony in relationships, encouraging unconditional love.", 
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500" 
    } 
  ]; 

  const storeFeatures = [ 
    { icon: Truck, title: "FAST SHIPPING", desc: "ORDERS OVER 500 RS" }, 
    { icon: Wallet, title: "BIG CASHBACK", desc: "OVER 10% CASHBACK" }, 
    { icon: ShieldCheck, title: "QUICK PAYMENT", desc: "100% SECURE" }, 
    { icon: Headphones, title: "24/7 SUPPORT", desc: "READY FOR YOU" }, 
  ]; 

  return ( 
    <div className="w-full bg-[#f4f5f5]"> 
      {/* 1. CINEMATIC POWER CARDS */} 
      <section className="w-full h-[75vh] md:h-[85vh] grid grid-cols-1 md:grid-cols-3 bg-[#2a3b63]"> 
        {collections.map((item) => ( 
          <Link 
            to={item.linkTo} 
            key={item.id} 
            className="relative w-full h-full overflow-hidden group cursor-pointer border-r border-white/10 last:border-0 block" 
          > 
            <img 
              src={item.image} 
              alt={item.title} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
            /> 
            <div className="absolute inset-0 bg-gradient-to-t from-[#2a3b63]/90 via-[#2a3b63]/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500"></div> 

            <div className="absolute bottom-0 left-0 w-full p-10 flex flex-col items-start z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500"> 
              <span className="bg-[#d4af37] text-white text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 mb-5 rounded-sm shadow-lg"> 
                {item.tag} 
              </span> 
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6 drop-shadow-md"> 
                {item.title} 
              </h2> 
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-white uppercase group-hover:text-[#d4af37] transition-colors"> 
                {item.linkText} 
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-2" /> 
              </div> 
            </div> 
          </Link> 
        ))} 
      </section> 

      {/* 2. FEATURED DETAILS GRID */} 
      <section className="py-24 px-8 max-w-6xl mx-auto"> 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20"> 
          {featuredDetails.map((item) => ( 
            <div key={item.id} className="group flex flex-col"> 
              <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-sm aspect-[4/3] mb-10"> 
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                /> 
              </div> 
              <div className="relative pl-4 md:pl-8"> 
                <span className="absolute -top-12 left-0 text-7xl md:text-8xl font-serif italic text-gray-200 font-light select-none -z-10"> 
                  {item.id}. 
                </span> 
                <h3 className="text-xl font-bold mb-3 tracking-wide" style={{ color: "#1a2238" }}> 
                  {item.title} 
                </h3> 
                <p className="text-sm text-gray-500 leading-relaxed pr-4 md:pr-12"> 
                  {item.description} 
                </p> 
              </div> 
            </div> 
          ))} 
        </div> 
      </section> 

      {/* 3. BRAND ESSENCE & FEATURES */} 
      <section className="bg-[#f6f5f2] py-28 px-6 flex flex-col items-center text-center"> 
        <div className="max-w-3xl mx-auto"> 
          <p className="text-[9px] md:text-[10px] font-bold tracking-[0.4em] text-[#a09e9a] uppercase mb-6"> 
            Bangalore Collective Maison 
          </p> 
          <h4 
            className="text-5xl md:text-7xl font-serif italic mb-6 tracking-tight" 
            style={{ color: "#1a2238" }} 
          > 
            Elegance in every detail. 
          </h4> 
          <p className="text-[#6b7280] text-sm md:text-base font-light mb-12 max-w-2xl mx-auto"> 
            Where sophistication meets effortless grace. Our pieces are crafted to be 
            reflections of your inner radiance. 
          </p> 
          <Link 
            to="/shop" 
            className="inline-block text-white text-[10px] md:text-xs font-bold tracking-[0.2em] px-12 py-4 rounded-full uppercase transition-colors duration-300 shadow-lg hover:opacity-80" 
            style={{ backgroundColor: "#2a3b63" }} 
          > 
            Shop The Deal 
          </Link> 
        </div> 

        <div className="w-full max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 mt-32"> 
          {storeFeatures.map((feature, index) => { 
            const IconComponent = feature.icon; 
            return ( 
              <div key={index} className="flex flex-col items-center text-center group"> 
                <IconComponent 
                  size={28} 
                  strokeWidth={1.5} 
                  className="mb-6 group-hover:scale-110 transition-transform duration-300" 
                  style={{ color: "#d4af37" }} 
                /> 
                <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "#1a2238" }}> 
                  {feature.title} 
                </h4> 
                <p className="text-[9px] tracking-[0.1em] text-gray-400 uppercase"> 
                  {feature.desc} 
                </p> 
              </div> 
            ); 
          })} 
        </div> 
      </section> 

      {/* 4. DYNAMIC PROMOTIONAL BANNERS */} 
      {promoCards.length > 0 && ( 
        <section className="bg-white pb-20 pt-10"> 
          <div className="text-white/90 text-[9px] md:text-[10px] font-bold tracking-[0.3em] uppercase py-3.5 text-center shadow-inner mb-12" style={{ backgroundColor: "#2a3b63" }}> 
            LIMITED TIME OFFER &nbsp;•&nbsp; SHOP THE LATEST ARRIVALS 
          </div> 

          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8"> 
            {promoCards.map((card, index) => ( 
              <Link 
                key={card.id || index} 
                to="/shop" 
                className="relative bg-[#f6f5f2] rounded-[2rem] overflow-hidden flex h-[380px] group hover:shadow-xl transition-all duration-300" 
              > 
                <div className="w-1/2 p-10 flex flex-col justify-center z-10"> 
                  <p className="text-[#a09e9a] text-[9px] font-bold tracking-[0.2em] uppercase mb-4">Featured Promo</p> 
                  <h3 className="text-3xl md:text-4xl font-serif leading-[1.1] mb-4 transition-colors duration-300" style={{ color: "#1a2238" }}> 
                    {card.title} 
                  </h3> 
                  <p className="text-sm text-gray-500 mb-8">{card.subtitle}</p> 
                  <span className="inline-block text-white px-8 py-3.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase shadow-md w-fit transition-colors duration-300" style={{ backgroundColor: "#1a2238" }}> 
                    Explore Offer 
                  </span> 
                </div> 
                <div className="w-1/2 h-full overflow-hidden"> 
                  {/* --- APPLIED THE HELPER AND CROSSORIGIN HERE --- */}
                  <img 
                    src={card.image ? getImageUrl(card.image) : "https://images.unsplash.com/photo-1599643478514-41d3d63b2f2d?w=500"} 
                    alt={card.title} 
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    onError={(e) => {
                      // Fallback if image path is completely broken
                      e.currentTarget.src = "https://images.unsplash.com/photo-1599643478514-41d3d63b2f2d?w=500";
                    }}
                  /> 
                </div> 
              </Link> 
            ))} 
          </div> 
        </section> 
      )} 

      {/* ========================================= 
      5. DYNAMIC INSTAGRAM FEED (Embedded Native UI) 
      ========================================= */} 
      {instaConfig.isActive && instaConfig.links.length > 0 && ( 
        <section className="bg-white py-24 border-t border-[#f4f5f5] overflow-hidden"> 
          <div className="max-w-[1400px] mx-auto px-6 text-center"> 
            <div className="flex items-center justify-center gap-3 mb-4"> 
              <Instagram size={32} style={{ color: "#d4af37" }} /> 
              <h2 className="leading-[1.1]" style={{ color: "#1a2238" }}> 
                <span className="insta-font text-5xl md:text-6xl font-normal tracking-wide">Instagram</span> 
                <br /> 
                <span className="text-3xl md:text-4xl font-serif italic font-light">Feed</span> 
              </h2> 

            </div> 
            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold mb-16 mt-4"> 
              Follow our latest creations 
            </p> 

            <div className="flex overflow-x-auto pb-8 gap-6 snap-x justify-start lg:justify-center hide-scrollbar"> 
              {instaConfig.links.map((link, index) => { 
                const cleanLink = link.split('?')[0]; 
                const embedUrl = cleanLink.endsWith('/') ? `${cleanLink}embed` : `${cleanLink}/embed`; 

                return ( 
                  <div key={index} className="flex-none snap-center w-[320px] md:w-[350px]"> 
                    <iframe 
                      src={embedUrl} 
                      className="w-full h-[540px] border border-gray-200 rounded-xl shadow-md bg-white" 
                      frameBorder="0" 
                      scrolling="no" 
                      allowTransparency={true} 
                      allow="encrypted-media" 
                      title={`Instagram post ${index + 1}`} 
                    ></iframe> 
                  </div> 
                ); 
              })} 
            </div> 
          </div> 

          <style dangerouslySetInnerHTML={{__html: ` 
            @import url('https://fonts.googleapis.com/css2?family=Grand+Hotel&display=swap'); 
            .insta-font { 
              font-family: 'Grand Hotel', cursive; 
            } 
            .hide-scrollbar::-webkit-scrollbar { display: none; } 
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } 
          `}} /> 
        </section> 
      )} 
    </div> 
  ); 
}