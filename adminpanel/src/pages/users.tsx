import { useState, useEffect } from "react";
import { Users, Mail, Calendar, Shield, User, Lock } from "lucide-react";
import api from "../api/axios";

export default function UsersList() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "user" | "admin">("all");

  useEffect(() => {
    // 1. Retrieve the JWT token stored during login
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication token missing. Please log in again.");
      setLoading(false);
      return;
    }

    // 2. Fetch users with the Authorization header
    api.get("/auth/users", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        // Check if it's a 401/403 error specifically
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError("Access Denied: You do not have admin permissions.");
        } else {
          setError("Could not load user directory. Please check your network connection.");
        }
        setLoading(false);
      });
  }, []);

  // Filter logic for Tabs
  const filteredUsers = users.filter((user) => {
    if (activeTab === "all") return true;
    const userRole = user.role || "user"; 
    return userRole.toLowerCase() === activeTab;
  });

  // Loading State
  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto w-full min-h-[60vh] flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="w-10 h-10 border-3 border-gray-100 border-t-[#c2a67a] rounded-full animate-spin mb-4"></div>
        <p className="text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase">Verifying Credentials...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto w-full animate-fade-in">
      
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="tracking-[0.3em] uppercase text-[10px] font-bold mb-2" style={{ color: "#c2a67a" }}>
            Admin Dashboard
          </h2>
          <h1 
  className="font-serif italic text-3xl md:text-4xl" 
  style={{ color: '#c2a67a' }}
>
  Directory Management
</h1>
        </div>
        <div className="flex items-center gap-3 bg-white px-6 py-3 shadow-sm border border-gray-100 rounded-2xl">
          <Users size={18} style={{ color: "#c2a67a" }} />
          <span className="text-xs font-bold tracking-[0.1em] text-gray-600 uppercase">
            Total Entities: {filteredUsers.length}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex p-1.5 bg-white border border-gray-200 rounded-xl w-fit shadow-sm mb-8">
        {(["all", "user", "admin"] as const).map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)} 
            className={`flex items-center px-8 py-3 rounded-lg text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
              activeTab === tab 
                ? 'bg-[#fdfbf7] text-[#c2a67a] shadow-sm border border-[#f3ece1]' 
                : 'text-gray-400 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            {tab === "all" && <Users className="inline mr-2.5" size={16} />}
            {tab === "user" && <User className="inline mr-2.5" size={16} />}
            {tab === "admin" && <Shield className="inline mr-2.5" size={16} />}
            {tab === "all" ? "All Accounts" : tab === "user" ? "Customers" : "Executives"}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 flex items-center justify-center gap-3 text-[11px] font-bold text-red-500 tracking-widest border border-red-100 py-5 bg-red-50/50 rounded-2xl animate-shake">
          <Lock size={14} /> {error}
        </div>
      )}

      {/* Data Table */}
      {!error && (
        <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden rounded-3xl border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f9fafb] border-b border-gray-100">
                  <th className="py-6 px-8 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Account Name</th>
                  <th className="py-6 px-8 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Contact Identity</th>
                  <th className="py-6 px-8 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Access Level</th>
                  <th className="py-6 px-8 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Date Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-[11px] font-bold tracking-widest text-gray-300 uppercase">
                      No matching records found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr key={user.id || index} className="hover:bg-[#fdfbf7] transition-colors group">
                      <td className="py-5 px-8">
                        <div className="font-bold text-sm tracking-wide flex items-center gap-4 text-slate-800">
                          <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-xs text-slate-400 font-serif italic group-hover:bg-[#c2a67a] group-hover:text-white group-hover:border-[#c2a67a] transition-all duration-300">
                            {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                          </div>
                          {user.name || "N/A"}
                        </div>
                      </td>
                      <td className="py-5 px-8">
                        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                          <Mail size={14} className="text-slate-300 group-hover:text-[#c2a67a] transition-colors" />
                          {user.email}
                        </div>
                      </td>
                      <td className="py-5 px-8">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-bold tracking-widest uppercase rounded-md shadow-sm ${
                          user.role === 'admin' 
                            ? 'bg-[#1a2238] text-[#c2a67a]' 
                            : 'bg-white border border-gray-200 text-gray-500'
                        }`}>
                          {user.role === 'admin' && <Shield size={10} />}
                          {user.role || 'User'}
                        </span>
                      </td>
                      <td className="py-5 px-8">
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium tracking-wide">
                          <Calendar size={14} className="text-slate-200" />
                          {user.created_at 
                            ? new Date(user.created_at).toLocaleDateString('en-US', {
                                month: 'short', day: '2-digit', year: 'numeric'
                              })
                            : "—"
                          }
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}