import { useNavigate } from "react-router-dom";
import { useState } from "react";
import changetheme from "../utils/themeChange";
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../redux/userSlice";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const [theme, setTheme] = useState(
    document.documentElement.dataset.theme || "light"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleThemeChange = () => {
    changetheme();
    setTheme(
      document.documentElement.dataset.theme === "dark" ? "light" : "dark"
    );
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast.warning("Eksik alan olmamalı", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    
    const res = await dispatch(userLogin({ email, password }));

    if (res.meta.requestStatus === "fulfilled") {
      navigate("/admin/dashboard"); 
    }
  };

  return (
    <div className="h-[80vh] flex items-center justify-center">
      <div className="w-[450px] bg-gray-300 dark:bg-neutral-900 p-5 rounded-xl">
        <div className="text-2xl mb-5 flex">
          Admin Login
          <button
            onClick={handleThemeChange}
            className="btn-admin uppercase flex justify-center items-center ml-5"
          >
            {theme === "dark" ? (
              <CiLight size={15} />
            ) : (
              <MdDarkMode size={15} />
            )}
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}{" "}
        <div className="mb-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-50 dark:!bg-stone-900 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="mb-5">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-50 dark:!bg-stone-900 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div>
          <button
            className="btn-admin"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <button className="btn-admin" onClick={() => navigate("/admin/register")}>
            Go to Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
