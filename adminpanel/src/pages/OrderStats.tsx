import { useEffect, useState } from "react";
import api from "../api/axios";
import { IndianRupee, ShoppingBag, Clock, Download, CheckCircle, XCircle } from "lucide-react";

export default function OrderStats() {
  const [stats, setStats] = useState({ totalOrders: 0, pending: 0, revenue: 0 });
  const [orders, setOrders] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch Top-Level Stats
    api.get("/orderstats/stats")
      .then(res => {
        setStats({
          totalOrders: Number(res.data.totalOrders || 0),
          pending: Number(res.data.pending || 0),
          revenue: Number(res.data.revenue || 0)
        });
      })
      .catch(err => console.error("Stats Fetch Error:", err));

    // 2. Fetch Detailed Orders
    api.get("/orders/all")
      .then(res => {
        setOrders(res.data);
        setLoading(false); // ⚡ Stops the loading screen
      })
      .catch(err => {
        console.error("Orders Fetch Error:", err);
        setLoading(false);
      });
  }, []);

  const getLogStatus = (status: string) => {
    if (!status) return false;
    const confirmedStates = ['completed', 'processing', 'approved', 'paid'];
    return confirmedStates.includes(status.toLowerCase());
  };

  const handleExportCSV = () => {
    if (orders.length === 0) return alert("No data available to export.");

    const headers = ["Order ID", "Customer Name", "Email", "Amount (INR)", "Fulfillment Status", "Log Status", "Date", "Products"];
    const csvRows = [headers.join(",")];
    
    orders.forEach(order => {
      const isConfirmed = getLogStatus(order.status);
      const productsList = order.items 
        ? order.items.map((item: any) => `${item.name} (x${item.quantity})`).join("; ") 
        : "N/A";

      const row = [
        `#${String(order.id).padStart(4, '0')}`,
        `"${order.customer_name || 'N/A'}"`,
        `"${order.email || 'N/A'}"`,
        order.total_amount,
        order.status,
        isConfirmed ? "Confirmed" : "Unconfirmed",
        new Date(order.created_at).toLocaleDateString("en-IN"),
        `"${productsList}"`
      ];
      csvRows.push(row.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `Order_Report_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
  };

  // ⚡ THE LOADING FIX ⚡
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <Clock className="animate-spin text-[#c2a67a]" size={32} />
        <p className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 animate-pulse">
          Syncing Ledger Data...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-10 px-4">
      
      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        <div className="bg-white p-8 rounded-xl shadow-lg flex items-center gap-6 border border-gray-50">
          <div className="p-4 rounded-full bg-emerald-50 text-emerald-600"><IndianRupee size={24} /></div>
          <div>
            <p className="text-[10px] uppercase font-black tracking-widest mb-1 text-gray-400">Gross Revenue</p>
            <p className="text-3xl font-serif text-[#1a1a1a]">₹{stats.revenue?.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg flex items-center gap-6 border border-gray-50">
          <div className="p-4 rounded-full bg-[#fdfbf7] text-[#c2a67a]"><ShoppingBag size={24} /></div>
          <div>
            <p className="text-[10px] uppercase font-black tracking-widest mb-1 text-gray-400">Total Orders</p>
            <p className="text-3xl font-serif text-[#1a1a1a]">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg flex items-center gap-6 border border-gray-50">
          <div className="p-4 rounded-full bg-amber-50 text-amber-600"><Clock size={24} /></div>
          <div>
            <p className="text-[10px] uppercase font-black tracking-widest mb-1 text-gray-400">Awaiting Action</p>
            <p className="text-3xl font-serif text-[#1a1a1a]">{stats.pending}</p>
          </div>
        </div>
      </div>

      {/* --- DETAILED TABLE --- */}
      <div className="pt-8 border-t border-[#f3ece1]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
          <div>
            <h2 className="text-2xl font-serif italic text-[#1a1a1a]">Comprehensive Ledger</h2>
            <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mt-2">Detailed Transaction Logs</p>
          </div>
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-6 py-3 text-[10px] font-black tracking-[0.2em] uppercase transition-all shadow-md bg-[#c2a67a] text-white hover:opacity-80 rounded-sm">
            <Download size={14} /> Export to CSV
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-[#f3ece1]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead className="bg-[#fdfbf7] border-b border-[#f3ece1]">
                <tr>
                  <th className="p-5 text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 whitespace-nowrap">Order #</th>
                  <th className="p-5 text-[10px] font-black tracking-[0.2em] uppercase text-gray-400">Client</th>
                  <th className="p-5 text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 min-w-[200px]">Products</th>
                  <th className="p-5 text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 whitespace-nowrap">Log Status</th>
                  <th className="p-5 text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 whitespace-nowrap">Fulfillment</th>
                  <th className="p-5 text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 whitespace-nowrap">Amount</th>
                  <th className="p-5 text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 whitespace-nowrap">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3ece1]">
                {orders.map((order) => {
                  const isConfirmed = getLogStatus(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-[#fafafa] transition-colors">
                      <td className="p-5 text-xs font-black text-[#1a1a1a] whitespace-nowrap">#{String(order.id).padStart(4, '0')}</td>
                      <td className="p-5">
                        <div className="text-xs font-bold uppercase text-[#1a1a1a] whitespace-nowrap">{order.customer_name}</div>
                        <div className="text-[10px] text-gray-400 font-medium">{order.email}</div>
                      </td>
                      <td className="p-5 max-w-[250px]">
                        <div className="text-[10px] leading-relaxed tracking-wider font-medium text-gray-500 truncate" title={order.items?.map((i:any)=>i.name).join(', ')}>
                          {order.items ? order.items.map((item: any) => `${item.name} (x${item.quantity})`).join(', ') : "Standard Order"}
                        </div>
                      </td>
                      <td className="p-5 whitespace-nowrap">
                        <div className={`flex items-center gap-2 text-[9px] font-black tracking-widest uppercase ${isConfirmed ? 'text-emerald-600' : 'text-rose-400'}`}>
                          {isConfirmed ? <CheckCircle size={12} /> : <XCircle size={12} />}
                          {isConfirmed ? 'Confirmed' : 'Unconfirmed'}
                        </div>
                      </td>
                      <td className="p-5 whitespace-nowrap">
                        <span className="text-[9px] font-black tracking-widest uppercase px-2 py-1 rounded bg-gray-50 border border-gray-100 text-gray-500">
                          {order.status}
                        </span>
                      </td>
                      <td className="p-5 text-sm font-serif italic text-[#c2a67a] whitespace-nowrap">₹{Number(order.total_amount).toLocaleString('en-IN')}</td>
                      <td className="p-5 text-[10px] font-bold tracking-widest uppercase text-gray-400 whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  );
                })}
                
                {/* Fallback if no orders exist */}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-10 text-center text-xs font-bold tracking-widest uppercase text-gray-400">
                      No transactions recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}