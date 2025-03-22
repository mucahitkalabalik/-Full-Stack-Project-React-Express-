import { Outlet, Navigate } from "react-router-dom";
import Header from "../components/mainLayout/MainHeader";
const isAuthenticated = () => {
  return localStorage.getItem("token");
};

const MainLayout = () => {
  return (
    <div className="bg-gray-100 text-zinc-500 h-[100vh] dark:bg-gray-800 dark:text-zinc-300">
      <Header />
      <Outlet />
    </div>
  );
};

export default MainLayout;
