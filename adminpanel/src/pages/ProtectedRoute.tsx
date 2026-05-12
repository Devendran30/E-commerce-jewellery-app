import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  // We use your exact key here!
  const isAuthenticated = localStorage.getItem("isAdminAuthenticated");

  if (!isAuthenticated) {
    // Kick them back to your login page
    return <Navigate to="/admin-login" replace />;
  }

  return <Outlet />;
}