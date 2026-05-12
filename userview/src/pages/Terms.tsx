export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-8 py-24 min-h-screen">
      <div className="text-center mb-16">
        {/* Main Title - Guaranteed Gold Color */}
        <h1 
          className="text-4xl font-serif italic mb-6" 
          style={{ color: "#c2a67a" }}
        >
          Terms & Conditions
        </h1>
        
        {/* Divider Line */}
        <div 
          className="w-12 h-[1px] mx-auto mb-6" 
          style={{ backgroundColor: "#c2a67a" }}
        ></div>
        
        {/* Date Text */}
        <p 
          className="text-[10px] tracking-[0.2em] uppercase font-bold" 
          style={{ color: "#8a94a6" }}
        >
          Last Updated: April 2026
        </p>
      </div>

      <div className="space-y-12 text-sm text-gray-600 leading-loose">
        <section>
          <h2 
            className="text-xs font-bold tracking-[0.2em] uppercase mb-4" 
            style={{ color: "#c2a67a" }}
          >
            1. General Overview
          </h2>
          <p>
            This website is operated by Bangalore Collective. Throughout the site, the terms "we", "us" and "our" refer to Bangalore Collective. We offer this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.
          </p>
        </section>

        <section>
          <h2 
            className="text-xs font-bold tracking-[0.2em] uppercase mb-4" 
            style={{ color: "#c2a67a" }}
          >
            2. Products and Services
          </h2>
          <p>
            Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy. We have made every effort to display as accurately as possible the colors and images of our products that appear at the store.
          </p>
        </section>

        <section>
          <h2 
            className="text-xs font-bold tracking-[0.2em] uppercase mb-4" 
            style={{ color: "#c2a67a" }}
          >
            3. Modifications to the Service and Prices
          </h2>
          <p>
            Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
          </p>
        </section>
      </div>
    </div>
  );
}