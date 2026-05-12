import { useEffect, useState } from "react";
import api from "../api/axios";

// 1. Define what an Order looks like for the User
interface Order {
  id: number;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function UserOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // NOTE: In a real app, you would get this from your Auth Context/Login state
  // For now, use the email you used to place your test order!
  const userEmail = "test@example.com"; 

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setLoading(true);
        // We call the specific user route
        const res = await api.get(`/orders/user/${userEmail}`);
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching your orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [userEmail]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-8 py-32 text-center">
        <p className="text-xs tracking-[0.3em] text-gray-400 animate-pulse uppercase">
          Retrieving your collection...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-8 py-20 min-h-screen">
      <header className="mb-16 border-b border-gray-100 pb-8">
        <h1 className="text-4xl font-serif italic text-[#1a2238] mb-4">Your Orders</h1>
        <p className="text-[10px] tracking-[0.2em] text-[#8a94a6] uppercase font-bold">
          History of elegance and craft
        </p>
      </header>

      {orders.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-gray-200">
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-8">
            You haven't placed any orders yet.
          </p>
          <a href="/shop" className="text-[10px] font-bold tracking-widest text-[#1a2238] border-b border-[#1a2238] pb-1 uppercase hover:text-[#c2a67a] hover:border-[#c2a67a] transition-all">
            Explore the Collection
          </a>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="group bg-white border border-gray-100 p-10 flex flex-col md:flex-row justify-between items-center hover:shadow-xl transition-all duration-500">
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold tracking-widest text-[#1a2238] uppercase">
                    Order #{order.id}
                  </span>
                  <span className={`text-[8px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full ${
                    order.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 tracking-widest uppercase">
                  Purchased on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>

              <div className="mt-8 md:mt-0 text-center md:text-right">
                <p className="text-2xl font-serif italic text-[#1a2238] mb-1">
                  ₹ {Number(order.total_amount).toLocaleString()}
                </p>
                <button className="text-[9px] font-bold tracking-[0.2em] text-[#c2a67a] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}