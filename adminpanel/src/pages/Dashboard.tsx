import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import type { ProductStats, OrderStats } from "../types";

export default function Dashboard() {
  const [prodStats, setProdStats] = useState<ProductStats | null>(null);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodRes, orderRes] = await Promise.all([
          api.get("/productstats/stats"), 
          api.get("/orderstats/stats")
        ]);
        setProdStats(prodRes.data);
        setOrderStats(orderRes.data);
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard overview</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-gray-500">Total Products</h3>
          <p className="text-2xl font-bold">{prodStats?.totalProducts || 0}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-gray-500">Out of Stock</h3>
          <p className="text-2xl font-bold text-red-500">{prodStats?.outOfStock || 0}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold">{orderStats?.totalOrders || 0}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-gray-500">Revenue</h3>
          <p className="text-2xl font-bold text-green-600">${orderStats?.revenue || 0}</p>
        </div>
      </div>

      <Link to="/products" className="bg-blue-500 text-white px-4 py-2 rounded">
        Manage Products
      </Link>
    </div>
  );
}