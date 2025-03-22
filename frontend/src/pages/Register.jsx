import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userRegister } from "../redux/userSlice";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";

import changetheme from "../utils/themeChange";
import validator from "validator";

const Register = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(
    document.documentElement.dataset.theme || "light"
  );
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!validator.isEmail(formData.email)) {
      newErrors.email = t("invalidEmail") || "Geçerli bir e-posta girin.";
    }
    if (!formData.name.trim() || formData.name.length < 3) {
      newErrors.name = t("invalidName") || "İsim en az 3 karakter olmalıdır.";
    }
    if (
      !validator.isStrongPassword(formData.password, {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
      })
    ) {
      newErrors.password =
        t("invalidPassword") ||
        "Şifre en az 6 karakter, bir büyük harf, bir küçük harf ve bir rakam içermelidir.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      toast.warning(
        errors.password
          ? "Şifre en az 6 karakter, bir büyük harf, bir küçük harf ve bir rakam içermelidir."
          : t("formError") || "Lütfen formu doğru doldurun.",
        {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      return;
    }

    const res = await dispatch(userRegister(formData));
    if (res) {
      navigate("/admin/login");
      toast.success(t("userCreated") || "Kullanıcı başarıyla oluşturuldu.", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleThemeChange = () => {
    changetheme();
    setTheme(
      document.documentElement.dataset.theme === "dark" ? "light" : "dark"
    );
  };

  return (
    <div className="h-[80vh] flex items-center justify-center">
      <div className="w-[450px] bg-gray-300 dark:bg-neutral-900 p-5 rounded-xl">
        <div className="text-2xl mb-5 flex">
          Admin Register
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

        {errors.general && (
          <div className="text-red-500 mb-3">{errors.general}</div>
        )}

        <div className="mb-5">
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
            className="bg-gray-50 dark:bg-stone-900 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:border-gray-600 dark:text-white"
          />
          {errors.email && (
            <div className="text-red-500 text-sm">{errors.email}</div>
          )}
        </div>

        <div className="mb-5">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="bg-gray-50 dark:bg-stone-900 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:border-gray-600 dark:text-white"
          />
          {errors.name && (
            <div className="text-red-500 text-sm">{errors.name}</div>
          )}
        </div>

        <div className="mb-5">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="bg-gray-50 dark:bg-stone-900 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:border-gray-600 dark:text-white"
          />
          {errors.password && (
            <div className="text-red-500 text-sm">{errors.password}</div>
          )}
        </div>

        <div className="flex gap-2">
          <button className="btn-admin" onClick={handleRegister}>
            Register
          </button>
          <button className="btn-admin" onClick={() => navigate("/admin/login")}>
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
