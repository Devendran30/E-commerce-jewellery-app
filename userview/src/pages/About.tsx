import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="py-24">
      {/* Hero Section */}
      <div className="text-center mb-24 px-8">
        {/* Main Title */}
        <h1 
          className="text-4xl md:text-5xl font-serif italic mb-6"
          style={{ color: "#1a2238" }}
        >
          Our Story
        </h1>
        
        {/* Divider Line */}
        <div 
          className="w-12 h-[1px] mx-auto mb-8"
          style={{ backgroundColor: "#c2a67a" }}
        ></div>
        
        {/* Subtitle */}
        <p 
          className="text-sm tracking-widest max-w-2xl mx-auto leading-relaxed uppercase"
          style={{ color: "#8a94a6" }}
        >
          Defining a new era of elegance, rooted in Koramangala, crafted for the world.
        </p>
      </div>

      {/* Split Content Section */}
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
        
        {/* Image */}
        <div className="aspect-[4/5] bg-gray-200 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop"
            alt="Jewelry Craftsmanship"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null; // prevents loop
              e.currentTarget.src ="https://via.placeholder.com/800x1000?text=Image+Not+Found";
            }}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center">
          {/* Sub-heading */}
          <h2 
            className="text-xs font-bold tracking-[0.3em] uppercase mb-4"
            style={{ color: "#c2a67a" }}
          >
            The Craft
          </h2>

          {/* Heading */}
          <h3 
            className="text-3xl font-serif italic mb-8"
            style={{ color: "#1a2238" }}
          >
            Uncompromising Quality.
          </h3>

          <p className="text-sm text-gray-600 leading-loose mb-6">
            The Bangalore Collective was founded with a singular vision: to bridge
            the gap between traditional craftsmanship and modern, uncompromising
            aesthetics. Every piece in our collection is thoughtfully designed and
            meticulously forged.
          </p>

          <p className="text-sm text-gray-600 leading-loose mb-10">
            We believe that fine jewelry is more than an accessory; it is a
            permanent expression of identity. By sourcing the highest quality
            materials and partnering with master artisans, we ensure that our
            creations are built not just for today, but for generations.
          </p>

          {/* Button */}
          <Link
            to="/shop"
            className="w-fit text-white text-[10px] font-bold tracking-[0.2em] px-10 py-4 uppercase hover:opacity-80 transition-opacity"
            style={{ backgroundColor: "#1a2238" }}
          >
            Discover the Collection
          </Link>
        </div>
      </div>
    </div>
  );
}