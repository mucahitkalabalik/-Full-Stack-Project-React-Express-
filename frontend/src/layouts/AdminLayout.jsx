import { Outlet, Navigate } from "react-router-dom";
import AdminNav from "../components/adminLayout/AdminNav";
const isAuthenticated = () => {
  return localStorage.getItem("token");
};
const isAdmin = () => {
  return localStorage.getItem("role") === "admin"; 
};

const AdminLayout = () => {
  if (!isAuthenticated() || !isAdmin()) {
    return <Navigate to="/admin/login" />;
  }
  return (
    <div className="bg-gray-100 text-zinc-500  dark:bg-zinc-800 dark:text-zinc-300 flex h-full min-h-screen">
      <AdminNav />
  
      <div className="flex-1 p-6">
      <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
