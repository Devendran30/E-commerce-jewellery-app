import { useEffect, useState } from "react";
import api from "../api/axios";

// UPDATED INTERFACE: Added payment details and address
interface Order {
  id: number;
  customer_name: string;
  email: string;
  address: string;
  total_amount: number;
  status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/all") 
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const res = await api.patch(`/orders/${id}`, { status: newStatus });
      
      // Update local state, including the dynamic payment status flip (Pending -> Paid/Void)
      setOrders(orders.map((o) => {
        if (o.id === id) {
          return { 
            ...o, 
            status: newStatus,
            payment_status: res.data.payment_status || o.payment_status
          };
        }
        return o;
      }));
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert("Failed to update status. Check connection.");
    }
  };

  // UPDATED: Styling for the new order lifecycle statuses
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' }; // Green
      case 'shipped':
        return { bg: '#f5f3ff', text: '#5b21b6', border: '#ddd6fe' }; // Purple
      case 'approved':
        return { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' }; // Blue
      case 'processing':
        return { bg: '#fdfbf7', text: '#c2a67a', border: '#f3ece1' }; // Gold
      case 'cancelled':
        return { bg: '#fff1f2', text: '#be123c', border: '#fecdd3' }; // Red
      default:
        return { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' }; // Gray
    }
  };

  // Helper for Payment Status color
  const getPaymentColor = (paymentStatus: string) => {
    if (paymentStatus === 'Paid') return 'text-green-600';
    if (paymentStatus === 'Void') return 'text-red-600';
    return 'text-orange-500'; // Pending
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-[10px] font-black tracking-[0.3em] uppercase animate-pulse" style={{ color: '#a5aebf' }}>
        Retrieving order ledger...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-fade-in">
      
      {/* Header Section */}
      <div className="flex justify-between items-end mb-8 border-b pb-6" style={{ borderColor: '#f3ece1' }}>
        <div>
          <h1 className="text-3xl font-serif italic mb-2" style={{ color: '#c2a67a' }}>
            Client Orders
          </h1>
          <p className="text-[10px] tracking-[0.3em] uppercase font-black" style={{ color: '#1a1a1a' }}>
            Logistics & Fulfillment
          </p>
        </div>
        <div className="text-[10px] tracking-[0.2em] uppercase font-bold px-4 py-2 rounded-sm shadow-sm" style={{ backgroundColor: '#1a1a1a', color: '#c2a67a' }}>
          {orders.length} Total Sales
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border rounded-xl p-16 text-center text-[10px] font-black tracking-[0.2em] uppercase shadow-sm" style={{ color: '#a5aebf', borderColor: '#f3ece1' }}>
          The order ledger is currently empty.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-xl overflow-hidden" style={{ border: '1px solid #f3ece1' }}>
          
          <div className="overflow-x-auto w-full">
            <table className="min-w-full text-left border-collapse whitespace-nowrap">
              
              <thead style={{ backgroundColor: '#fdfbf7', borderBottom: '1px solid #f3ece1' }}>
                <tr>
                  <th className="p-5 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#a5aebf' }}>Order Ref</th>
                  <th className="p-5 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#a5aebf' }}>Client Details</th>
                  <th className="p-5 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#a5aebf' }}>Financials</th>
                  <th className="p-5 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#a5aebf' }}>Payment</th>
                  <th className="p-5 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#a5aebf' }}>Date</th>
                  <th className="p-5 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#a5aebf' }}>Fulfillment</th>
                </tr>
              </thead>
              
              <tbody>
                {orders.map((order) => {
                  const statusTheme = getStatusStyle(order.status);
                  
                  return (
                    <tr 
                      key={order.id} 
                      className="transition-colors hover:bg-[#fafafa]"
                      style={{ borderBottom: '1px solid #f3ece1' }}
                    >
                      {/* ID */}
                      <td className="p-5 text-xs font-black tracking-wider" style={{ color: '#1a1a1a' }}>
                        ORD-{String(order.id).padStart(4, '0')}
                      </td>
                      
                      {/* Client Name & Email */}
                      <td className="p-5">
                        <div className="text-xs font-bold tracking-wider uppercase mb-1" style={{ color: '#1a1a1a' }}>
                          {order.customer_name}
                        </div>
                        <div className="text-[10px] tracking-widest lowercase font-medium mb-1" style={{ color: '#a5aebf' }}>
                          {order.email}
                        </div>
                        {/* Display truncated address */}
                        <div className="text-[9px] tracking-widest uppercase font-bold text-gray-400 max-w-[200px] truncate" title={order.address}>
                          {order.address}
                        </div>
                      </td>
                      
                      {/* Total */}
                      <td className="p-5 text-lg font-serif italic" style={{ color: '#c2a67a' }}>
                        ₹ {Number(order.total_amount).toLocaleString()}
                      </td>

                      {/* NEW: Payment Details Column */}
                      <td className="p-5">
                        <div className="text-[10px] font-black tracking-[0.2em] uppercase mb-1 border px-2 py-0.5 rounded-sm inline-block" style={{ borderColor: '#e5e7eb', color: '#1a1a1a' }}>
                          {order.payment_method === 'cod' ? 'C.O.D.' : 'CARD'}
                        </div>
                        <div className={`text-[9px] font-black tracking-[0.2em] uppercase ${getPaymentColor(order.payment_status || 'Pending')}`}>
                          • {order.payment_status || 'Pending'}
                        </div>
                      </td>
                      
                      {/* Date */}
                      <td className="p-5 text-[11px] font-bold tracking-widest uppercase" style={{ color: '#a5aebf' }}>
                        {new Date(order.created_at).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      
                      {/* Action Dropdown */}
                      <td className="p-5">
                        <div className="relative inline-block w-40">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            disabled={order.status === 'Delivered' || order.status === 'Cancelled'}
                            className={`w-full appearance-none text-[10px] font-black tracking-widest uppercase px-3 py-2.5 pr-8 rounded-sm outline-none transition-all ${(order.status === 'Cancelled' || order.status === 'Delivered') ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:brightness-95 shadow-sm'}`}
                            style={{ 
                              backgroundColor: statusTheme.bg,
                              color: statusTheme.text,
                              border: `1px solid ${statusTheme.border}`
                            }}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Approved">Approved</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          {/* Custom dropdown arrow - hide if disabled */}
                          {!(order.status === 'Delivered' || order.status === 'Cancelled') && (
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3" style={{ color: statusTheme.text }}>
                              ▼
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}