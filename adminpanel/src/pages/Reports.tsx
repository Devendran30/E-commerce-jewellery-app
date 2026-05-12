import { useEffect, useState } from "react";
import api from "../api/axios";
import { 
  Package, ShoppingCart, Activity, AlertTriangle, 
  CheckCircle, Clock, IndianRupee, TrendingUp 
} from "lucide-react";

export default function Reports() {
  const [productStats, setProductStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    outOfStock: 0
  });

  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pending: 0,
    completed: 0,
    revenue: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch both stats in parallel
    Promise.all([
      api.get("/productstats/stats"),
      api.get("/orderstats/stats")
    ])
      .then(([prodRes, orderRes]) => {
        setProductStats(prodRes.data);
        setOrderStats(orderRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching report data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-gray-500 tracking-widest uppercase text-xs">Generating Reports...</div>;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif italic text-[#1a2238]">Executive Reports</h1>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Bangalore Collective Performance Overview</p>
      </div>

      {/* 1. ORDER PERFORMANCE STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`₹${orderStats.revenue?.toLocaleString()}`} 
          icon={<IndianRupee className="text-emerald-500" size={20} />} 
          color="bg-emerald-50" 
        />
        <StatCard 
          title="Total Orders" 
          value={orderStats.totalOrders} 
          icon={<ShoppingCart className="text-blue-500" size={20} />} 
          color="bg-blue-50" 
        />
        <StatCard 
          title="Completed" 
          value={orderStats.completed} 
          icon={<CheckCircle className="text-indigo-500" size={20} />} 
          color="bg-indigo-50" 
        />
        <StatCard 
          title="Pending" 
          value={orderStats.pending} 
          icon={<Clock className="text-amber-500" size={20} />} 
          color="bg-amber-50" 
        />
      </div>

      {/* 2. PRODUCT & INVENTORY STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Inventory" 
          value={productStats.totalProducts} 
          icon={<Package className="text-slate-500" size={20} />} 
          color="bg-slate-50" 
        />
        <StatCard 
          title="Active Listings" 
          value={productStats.activeProducts} 
          icon={<Activity className="text-emerald-500" size={20} />} 
          color="bg-emerald-50" 
        />
        <StatCard 
          title="Out of Stock" 
          value={productStats.outOfStock} 
          icon={<AlertTriangle className="text-rose-500" size={20} />} 
          color="bg-rose-50" 
        />
      </div>

      {/* 3. DETAILED BREAKDOWN TABLE */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xs font-bold tracking-[0.2em] text-[#1a2238] uppercase">Stock Analysis</h2>
          <TrendingUp size={16} className="text-[#c2a67a]" />
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
            <tr>
              <th className="px-6 py-4">Metric</th>
              <th className="px-6 py-4">Current Value</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            <tr>
              <td className="px-6 py-4 text-gray-600">Inventory Health</td>
              <td className="px-6 py-4 font-bold">{((productStats.activeProducts / productStats.totalProducts) * 100).toFixed(1)}% Active</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded uppercase">Healthy</span>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-gray-600">Average Order Value</td>
              <td className="px-6 py-4 font-bold">₹{(orderStats.revenue / orderStats.totalOrders).toFixed(0)}</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">Standard</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Reusable Stat Card Component
function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white p-6 border border-gray-100 rounded-lg flex items-center gap-6 shadow-sm">
      <div className={`${color} p-4 rounded-full`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1">{title}</p>
        <p className="text-xl font-serif text-[#1a2238]">{value}</p>
      </div>
    </div>
  );
}