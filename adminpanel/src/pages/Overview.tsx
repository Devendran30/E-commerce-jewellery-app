import { useEffect, useState } from "react";
import api from "../api/axios";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from "recharts";

// Map specific statuses to your luxury brand colors
const STATUS_COLORS: Record<string, string> = {
  'Delivered': '#166534', // Deep Green
  'Shipped': '#5b21b6',   // Royal Purple
  'Approved': '#1e40af',  // Navy Blue
  'Processing': '#c2a67a',// Bangalore Gold
  'Cancelled': '#be123c', // Crimson Red
};

// Fallback color if a weird status gets in
const FALLBACK_COLOR = "#a5aebf";

export default function Overview() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get("/orders/stats")
      .then(res => setData(res.data))
      .catch(err => {
        console.error("Dashboard Error:", err);
        setError(err.response?.data?.message || err.message || "Backend connection failed.");
      });
  }, []);

  if (error) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center h-[50vh] animate-fade-in">
        <div className="text-red-500 text-2xl font-serif italic mb-4">Connection Failed</div>
        <div className="text-gray-600 bg-red-50 p-4 border border-red-200 font-mono text-sm max-w-lg rounded-md shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!data) return (
    <div className="p-10 tracking-[0.3em] uppercase text-[10px] font-bold text-center mt-20 animate-pulse" style={{ color: '#c2a67a' }}>
      Gathering analytics...
    </div>
  );

  // Calculate high-level metrics
  const totalRevenue = data?.sales?.reduce((sum: number, item: any) => sum + (Number(item.total) || 0), 0) || 0;
  const totalOrders = data?.status?.reduce((sum: number, item: any) => sum + (Number(item.count) || 0), 0) || 0;
  const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;

  return (
    <div className="p-8 space-y-10 bg-[#fafafa] min-h-screen animate-fade-in font-sans">
      <header className="border-b pb-6" style={{ borderColor: '#f3ece1' }}>
        <h1 className="text-3xl font-serif italic" style={{ color: '#c2a67a' }}>
          Business Overview
        </h1>
        <p className="text-[10px] tracking-[0.3em] uppercase font-black mt-2" style={{ color: '#1a1a1a' }}>
          Real-time Performance Metrics
        </p>
      </header>

      {/* Top Stats Cards - Now with 3 columns! */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-xl border-none flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#c2a67a]"></div>
          <p className="text-[10px] uppercase font-black tracking-widest mb-2" style={{ color: '#a5aebf' }}>
            Total Volume
          </p>
          <p className="text-4xl font-serif text-[#1a1a1a]">
            ₹{totalRevenue.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-xl border-none flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#1a1a1a]"></div>
          <p className="text-[10px] uppercase font-black tracking-widest mb-2" style={{ color: '#a5aebf' }}>
            Orders Placed
          </p>
          <p className="text-4xl font-serif text-[#1a1a1a]">
            {totalOrders}
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-xl border-none flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gray-300"></div>
          <p className="text-[10px] uppercase font-black tracking-widest mb-2" style={{ color: '#a5aebf' }}>
            Average Order Value
          </p>
          <p className="text-4xl font-serif text-[#1a1a1a]">
            ₹{Math.round(averageOrderValue).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Trend Graph */}
        <div className="bg-white p-8 rounded-xl shadow-xl border-none flex flex-col">
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8 border-b pb-4" style={{ color: '#1a1a1a', borderColor: '#f3ece1' }}>
            Revenue Trend (7 Days)
          </h3>
          
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.sales || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3ece1" />
                <XAxis dataKey="date" tick={{fontSize: 10, fill: '#a5aebf', fontWeight: 'bold'}} stroke="#e5e7eb" tickMargin={12} />
                <YAxis tick={{fontSize: 10, fill: '#a5aebf', fontWeight: 'bold'}} stroke="#e5e7eb" tickMargin={12} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                 contentStyle={{ borderRadius: '8px', border: '1px solid #f3ece1', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                 itemStyle={{ color: '#c2a67a', fontWeight: 'bold' }}
                 formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, "Revenue"]}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#1a1a1a" 
                  strokeWidth={3} 
                  dot={{ r: 5, fill: "#ffffff", stroke: "#1a1a1a", strokeWidth: 2 }} 
                  activeDot={{ r: 8, fill: "#c2a67a", stroke: "#ffffff", strokeWidth: 2 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Pie Chart */}
        <div className="bg-white p-8 rounded-xl shadow-xl border-none flex flex-col">
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8 border-b pb-4" style={{ color: '#1a1a1a', borderColor: '#f3ece1' }}>
            Fulfillment Distribution
          </h3>
          
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.status || []}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="45%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={4}
                  stroke="none"
                >
                  {/* Map the colors intelligently based on the status string */}
                  {(data?.status || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || FALLBACK_COLOR} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #f3ece1', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: 'bold', color: '#1a1a1a' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle" 
                  wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.15em' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}