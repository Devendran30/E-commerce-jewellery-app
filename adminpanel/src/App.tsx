import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, ShoppingBag, Users, 
  Package, LogOut, ChevronDown, ShieldCheck,
  FileText, Home as HomeIcon 
} from "lucide-react";

// --- PAGE IMPORTS ---
import Overview from "./pages/Overview";
import Login from "./pages/Login";
import Products from "./pages/products"; 
import AddProduct from "./pages/Addproduct"; 
import EditProduct from "./pages/EditProduct"; 
import UsersPage from "./pages/users";
import Orders from "./pages/Orders";
import ProductStats from "./pages/ProductStats"; 
import OrderStats from "./pages/OrderStats";     
import CreateAdmin from "./pages/Createadmin";
import Homemanagement from "./pages/Homemanagement";


// --- THE GATEKEEPER ---
// This wrapper checks for the auth token before letting anyone see the admin routes
const ProtectedRoute = ({ children }: { children: any }) => {
  const isAuthenticated = localStorage.getItem("isAdminAuthenticated") === "true";
  
  if (!isAuthenticated) {
    // If they don't have the pass, kick them to the login screen!
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // State for Dropdowns
  const [isInventoryOpen, setIsInventoryOpen] = useState(
    path === '/add-product' || path === '/products' || path.startsWith('/edit-product')
  );
  
  const [isReportsOpen, setIsReportsOpen] = useState(
    path === '/product-stats' || path === '/order-stats'
  );

  const isActive = (route: string) => 
    path === route || (route === '/products' && path.startsWith('/edit-product'))
      ? "bg-[#2a3655] text-white border-l-4 border-[#c2a67a]" 
      : "text-gray-400 hover:bg-[#2a3655] hover:text-white border-l-4 border-transparent transition-all duration-200";

  // SECURE LOGOUT LOGIC
  const handleLogout = () => {
    // This destroys the VIP pass so the login screen appears next time!
    localStorage.removeItem("isAdminAuthenticated");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="w-[280px] bg-[#1a2238] text-sm font-medium flex flex-col border-r border-[#2a3655] shadow-xl z-20">
      
      {/* Branding Section */}
      <div className="p-6">
        <div 
          className="relative w-full py-10 text-center rounded-lg overflow-hidden shadow-2xl flex flex-col items-center justify-center"
          style={{
            backgroundImage: `linear-gradient(rgba(26, 34, 56, 0.85), rgba(21, 27, 45, 0.95)), url('https://images.unsplash.com/photo-1599643478514-4a820c559dbf?auto=format&fit=crop&q=80&w=600')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '1px solid rgba(194, 166, 122, 0.3)' 
          }}
        >
          <h1 
            className="text-3xl text-white mb-3"
            style={{ 
              fontFamily: "'Brush Script MT', 'Lucida Handwriting', 'Pacifico', cursive",
              fontWeight: 500,
              textShadow: '0 4px 15px rgba(0,0,0,0.6)' 
            }}
          >
            Bangalore Collective
          </h1>

          <div className="flex flex-col items-center">
            <span className="text-[8.5px] tracking-[0.3em] uppercase text-[#c2a67a] font-serif font-bold">
              Luxury 
            </span>
            <span className="text-[8.5px] tracking-[0.3em] uppercase text-[#c2a67a] font-serif font-bold mt-[2px]">
              Jewels
            </span>
          </div>
        </div>
      </div>

      {/* Gold Executive Portal Title */}
      <div className="px-8 mt-2 mb-6 text-[10px] text-[#c2a67a] tracking-[0.2em] uppercase font-bold flex items-center gap-2">
        <span className="text-[12px]">✦</span>
        <span className="underline underline-offset-4 decoration-[#c2a67a]/50">
          Executive Portal
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-2 px-4 mt-2 overflow-y-auto">
        <Link to="/" className={`flex items-center gap-3 px-4 py-3 rounded-r-lg ${isActive('/')}`}>
          <LayoutDashboard size={18} strokeWidth={1.5} className="text-[#c2a67a]" />
          <span className="tracking-wide">Overview</span>
        </Link>

        {/* STOREFRONT MANAGEMENT LINK */}
        <Link to="/manage-home" className={`flex items-center gap-3 px-4 py-3 rounded-r-lg ${isActive('/manage-home')}`}>
          <HomeIcon size={18} strokeWidth={1.5} className="text-[#c2a67a]" />
          <span className="tracking-wide uppercase font-bold text-[11px]">Storefront</span>
        </Link>

        <Link to="/create-admin" className={`flex items-center gap-3 px-4 py-3 rounded-r-lg ${isActive('/create-admin')}`}>
          <ShieldCheck size={18} strokeWidth={1.5} className="text-[#c2a67a]" />
          <span className="tracking-wide uppercase font-bold text-[11px]">Admin Creations</span>
        </Link>

        {/* Reports Dropdown */}
        <div className="mt-2">
          <button 
            onClick={() => setIsReportsOpen(!isReportsOpen)}
            className="w-full flex items-center justify-between text-gray-400 px-4 py-3 hover:text-white transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <FileText size={18} strokeWidth={1.5} className="text-[#c2a67a]" />
              <span className="tracking-wide uppercase font-bold text-[11px]">Reports</span>
            </div>
            <ChevronDown 
              size={14} 
              className={`transition-transform duration-300 ${isReportsOpen ? "rotate-180 text-[#c2a67a]" : ""}`} 
            />
          </button>

          <div 
            className={`flex flex-col gap-1 pl-11 border-l border-gray-700 ml-6 overflow-hidden transition-all duration-300 ease-in-out ${
              isReportsOpen ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"
            }`}
          >
            <Link to="/product-stats" className={`py-2 text-[10px] tracking-widest uppercase font-bold ${path === '/product-stats' ? 'text-[#c2a67a]' : 'text-gray-400 hover:text-white'}`}>Product Stats</Link>
            <Link to="/order-stats" className={`py-2 text-[10px] tracking-widest uppercase font-bold ${path === '/order-stats' ? 'text-[#c2a67a]' : 'text-gray-400 hover:text-white'}`}>Order Stats</Link>
          </div>
        </div>
        
        <Link to="/orders" className={`flex items-center gap-3 px-4 py-3 rounded-r-lg ${isActive('/orders')}`}>
          <ShoppingBag size={18} strokeWidth={1.5} className="text-[#c2a67a]" />
          <span className="tracking-wide uppercase font-bold text-[11px]">Orders</span>
        </Link>
        

        {/* Inventory Dropdown */}
        <div className="mt-2">
          <button 
            onClick={() => setIsInventoryOpen(!isInventoryOpen)}
            className="w-full flex items-center justify-between text-gray-400 px-4 py-3 hover:text-white transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Package size={18} strokeWidth={1.5} className="text-[#c2a67a]" />
              <span className="tracking-wide text-white uppercase font-bold text-[11px]">Inventory</span>
            </div>
            <ChevronDown 
              size={14} 
              className={`transition-transform duration-300 ${isInventoryOpen ? "rotate-180 text-[#c2a67a]" : ""}`} 
            />
          </button>

          <div 
            className={`flex flex-col gap-1 pl-11 border-l border-gray-700 ml-6 overflow-hidden transition-all duration-300 ease-in-out ${
              isInventoryOpen ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"
            }`}
          >
            <Link to="/add-product" className={`py-2 text-[10px] tracking-widest uppercase font-bold ${path === '/add-product' ? 'text-[#c2a67a]' : 'text-gray-400 hover:text-white'}`}>Add New</Link>
            <Link to="/products" className={`py-2 text-[10px] tracking-widest uppercase font-bold ${path === '/products' ? 'text-[#c2a67a]' : 'text-gray-400 hover:text-white'}`}>All Products</Link>
          </div>
        </div>

        <Link to="/users" className={`flex items-center gap-3 px-4 py-3 rounded-r-lg ${isActive('/users')}`}>
          <Users size={18} strokeWidth={1.5} className="text-[#c2a67a]" />
          <span className="tracking-wide uppercase font-bold text-[11px]">User</span>
        </Link>
      </div>

      {/* Logout Button */}
      <div className="p-6 mt-auto">
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 w-full py-4 bg-[#151b2d] border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-red-500 hover:bg-red-500/10 transition-all duration-300 group"
        >
          <LogOut size={16} className="text-[#c2a67a] group-hover:text-red-500 group-hover:scale-110 transition-all" />
          <span className="text-xs font-bold tracking-widest uppercase group-hover:text-red-500 transition-colors">End Session</span>
        </button>
      </div>
    </nav>
  );
}

function TopHeader() {
  return (
    <header className="h-20 flex items-center justify-between px-10 border-b border-gray-200 bg-white shadow-sm z-10">
      <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
        <ShieldCheck size={16} strokeWidth={2} />
        SECURE SESSION
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-sm font-bold tracking-wider text-[#1a2238]">EXECUTIVE ADMIN</div>
          <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Bangalore Collective</div>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#1a2238] text-[#c2a67a] flex items-center justify-center text-sm font-serif italic border-2 border-gray-100 shadow-inner">
          BC
        </div>
      </div>
    </header>
  );
}

// --- MAIN ADMIN LAYOUT ---
// This layout only renders if the Gatekeeper lets them in!
function AdminLayout() {
  return (
    <div className="flex h-screen bg-[#f4f5f5] font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <TopHeader />
        <div className="flex-1 overflow-y-auto p-10">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/product-stats" element={<ProductStats />} />
            <Route path="/manage-home" element={<Homemanagement />} />
            <Route path="/order-stats" element={<OrderStats />} />
            <Route path="/products" element={<Products />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/create-admin" element={<CreateAdmin />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

// --- ROOT ROUTING COMPONENT ---
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Unprotected Public Route */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}