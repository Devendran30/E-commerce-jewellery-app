export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-8 py-24 min-h-screen">
      <div className="text-center mb-16">
        {/* Main Title */}
        <h1 
          className="text-4xl font-serif italic mb-6"
          style={{ color: "#1a2238" }}
        >
          Privacy Policy
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
            style={{ color: "#1a2238" }}
          >
            1. Information We Collect
          </h2>
          <p>
            When you visit the Bangalore Collective site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the site, we collect information about the individual web pages or products that you view.
          </p>
        </section>

        <section>
          <h2 
            className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
            style={{ color: "#1a2238" }}
          >
            2. How We Use Your Information
          </h2>
          <p>
            We use the Order Information that we collect generally to fulfill any orders placed through the site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).
          </p>
        </section>

        <section>
          <h2 
            className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
            style={{ color: "#1a2238" }}
          >
            3. Data Retention
          </h2>
          <p>
            When you place an order through the site, we will maintain your Order Information for our records unless and until you ask us to delete this information.
          </p>
        </section>
      </div>
    </div>
  );
}