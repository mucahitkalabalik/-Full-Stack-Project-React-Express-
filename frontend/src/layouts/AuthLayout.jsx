import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AuthLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentPath = window.location.pathname;

    if (token) {
      navigate("/admin/dashboard");
    } else {
      if (currentPath !== "/admin/register") {
        navigate("/admin/login");
      }
    }
  }, [navigate]);

  return (
    <div className="bg-gray-100 text-zinc-500 h-[100vh] dark:bg-zinc-800 dark:text-zinc-300">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
