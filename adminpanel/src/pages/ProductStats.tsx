import { useEffect, useState } from "react";
import api from "../api/axios";
import { Package, Activity, AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function ProductStats() {
  const [stats, setStats] = useState({ totalProducts: 0, activeProducts: 0, outOfStock: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/productstats/stats")
      .then(res => {
        setStats({
          totalProducts: Number(res.data.totalProducts || 0),
          activeProducts: Number(res.data.activeProducts || 0),
          outOfStock: Number(res.data.outOfStock || 0)
        });
      })
      .catch(err => console.error("Frontend Fetch Error:", err))
      .finally(() => setLoading(false));
  }, []);

  // Calculate Draft/Hidden products so the chart equals 100% of Total Products
  const draftProducts = Math.max(0, stats.totalProducts - stats.activeProducts - stats.outOfStock);

  // Data specifically formatted for the Recharts Donut Chart
  const chartData = [
    { name: 'Live on Site', value: stats.activeProducts, color: '#059669' }, // Emerald Green
    { name: 'Out of Stock', value: stats.outOfStock, color: '#e11d48' },     // Rose Red
    { name: 'Draft / Hidden', value: draftProducts, color: '#e5e7eb' }       // Subtle Gray
  ].filter(item => item.value > 0); // Only render slices that actually have products

  if (loading) {
    return (
      <div className="p-10 tracking-[0.3em] uppercase text-[10px] font-bold text-center mt-20 animate-pulse text-[#c2a67a]">
        Analyzing Inventory Data...
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in font-sans">
      
      {/* Header */}
      <header className="border-b border-gray-200 pb-8">
        <h1 
  style={{ 
    color: '#c2a67a', 
    fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    fontStyle: 'italic',
    fontSize: '2.25rem', 
    lineHeight: '2.5rem',
    margin: '0',
    paddingBottom: '0.5rem'
  }}
>
  Product Inventory
</h1>
        <p className="text-[10px] tracking-[0.3em] uppercase font-bold mt-3 text-gray-500">
          Stock Level Analysis
        </p>
      </header>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <div className="bg-white p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-6">
          <div className="p-4 bg-[#FCFBF8] border border-gray-100 text-[#c2a67a]">
            <Package size={24} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] mb-1 text-gray-400">Total Items</p>
            <p className="text-3xl font-serif text-black">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="bg-white p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-600"></div>
          <div className="p-4 bg-emerald-50 text-emerald-600">
            <Activity size={24} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] mb-1 text-gray-400">Live on Site</p>
            <p className="text-3xl font-serif text-black">{stats.activeProducts}</p>
          </div>
        </div>

        <div className="bg-white p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-600"></div>
          <div className="p-4 bg-rose-50 text-rose-600">
            <AlertTriangle size={24} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] mb-1 text-gray-400">Out of Stock</p>
            <p className="text-3xl font-serif text-black">{stats.outOfStock}</p>
          </div>
        </div>
      </div>

      {/* Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Inventory Health Donut Chart */}
        <div className="bg-white p-8 md:p-10 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
          <div className="flex justify-between items-end border-b border-gray-100 pb-5 mb-8">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-black">Inventory Distribution</h3>
            <span className="text-[9px] uppercase tracking-widest text-gray-400">Real-time</span>
          </div>
          
          <div style={{ width: '100%', height: 320 }} className="flex justify-center items-center">
            {stats.totalProducts === 0 ? (
              <div className="text-xs tracking-widest uppercase text-gray-400 font-bold">No Data Available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    innerRadius={90}
                    outerRadius={120}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '0px', border: '1px solid #e5e7eb', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', padding: '12px' }}
                    itemStyle={{ fontWeight: 'bold', color: '#000000', fontSize: '14px', fontFamily: 'serif' }}
                    formatter={(value: any) => [`${value} Pieces`, "Amount"]}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={40} 
                    iconType="square" 
                    iconSize={8}
                    wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.15em' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Text-Based Insight Panel */}
        <div className="bg-[#FCFBF8] p-8 md:p-10 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#c2a67a] opacity-5 rounded-bl-full pointer-events-none"></div>
          
          <h3 className="text-2xl font-serif italic text-black mb-6">Executive Summary</h3>
          
          <div className="space-y-6">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-2">Availability Status</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Currently, <strong className="text-black">{stats.activeProducts} pieces</strong> are live and available for purchase. 
                {stats.outOfStock > 0 && ` Attention is required for ${stats.outOfStock} out-of-stock items.`}
              </p>
            </div>

            {draftProducts > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-2">Hidden Assets</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  You have <strong className="text-black">{draftProducts} pieces</strong> in your inventory that are currently hidden or marked as drafts.
                </p>
              </div>
            )}
            
            <div className="pt-4 border-t border-gray-200">
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden flex">
                <div style={{ width: `${(stats.activeProducts / Math.max(1, stats.totalProducts)) * 100}%` }} className="bg-emerald-500 h-full"></div>
                <div style={{ width: `${(stats.outOfStock / Math.max(1, stats.totalProducts)) * 100}%` }} className="bg-rose-500 h-full"></div>
                <div style={{ width: `${(draftProducts / Math.max(1, stats.totalProducts)) * 100}%` }} className="bg-gray-300 h-full"></div>
              </div>
              <p className="text-[9px] tracking-widest uppercase font-bold text-gray-400 mt-3 text-right">
                {Math.round((stats.activeProducts / Math.max(1, stats.totalProducts)) * 100)}% Fulfillment Capacity
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}