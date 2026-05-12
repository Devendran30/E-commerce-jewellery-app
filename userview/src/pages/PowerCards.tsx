import { ArrowRight, Compass } from "lucide-react";

export default function PowerCards() {
  const collections = [
    {
      id: 1,
      tag: "SALE!",
      title: "Love Inspires",
      image: "https://images.unsplash.com/photo-1599643478524-fb66f7cecb11?q=80&w=1000&auto=format&fit=crop", // Pearl placeholder
      linkText: "Explore Collection",
    },
    {
      id: 2,
      tag: "PENDANTS",
      title: "Classic Hits",
      image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1000&auto=format&fit=crop", // Gold rings placeholder
      linkText: "Explore Collection",
    },
    {
      id: 3,
      tag: "DISCOVER!",
      title: "New Arrival",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop", // Gold earrings placeholder
      linkText: "Explore Collection",
      hasFloatingButton: true,
    }
  ];

  return (
    <div className="w-full h-[75vh] md:h-[85vh] grid grid-cols-1 md:grid-cols-3 bg-[#151b2d]">
      {collections.map((item) => (
        <div 
          key={item.id} 
          className="relative w-full h-full overflow-hidden group cursor-pointer border-r border-white/10 last:border-0"
        >
          {/* High-Fidelity Background Image */}
          <img
            src={item.image}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />

          {/* Cinematic Gradient Overlay (Darkens bottom for text contrast) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>

          {/* Text Content Wrapper */}
          <div className="absolute bottom-0 left-0 w-full p-10 flex flex-col items-start z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            
            {/* Small Gold Tag */}
            <span className="bg-[#d4af37] text-white text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 mb-5 rounded-sm shadow-lg">
              {item.tag}
            </span>

            {/* Elegant Title */}
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-6 drop-shadow-md">
              {item.title}
            </h2>

            {/* Link & Arrow */}
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-white uppercase group-hover:text-[#d4af37] transition-colors">
              {item.linkText}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-2" />
            </div>
          </div>

          {/* Special 'Enter Maison' Floating Button (Only on Card 3) */}
          {item.hasFloatingButton && (
            <div className="absolute bottom-10 right-10 z-20 hidden md:block">
              <button className="flex items-center gap-4 bg-white/95 backdrop-blur-sm text-[#2a3b63] pl-2 pr-6 py-2 rounded-full hover:bg-white hover:scale-105 transition-all shadow-2xl">
                <div className="bg-[#2a3b63] text-[#d4af37] p-2.5 rounded-full">
                  <Compass size={16} strokeWidth={2} />
                </div>
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase pt-0.5">
                  Enter Maison
                </span>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}