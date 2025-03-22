import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MdDarkMode } from "react-icons/md";
import { IoMdBasket } from "react-icons/io";
import { FiSettings } from "react-icons/fi";
import { RiAdminFill } from "react-icons/ri";
import { MdOutlineLightMode } from "react-icons/md";
import { toast } from "react-toastify";

import changetheme from "../../utils/themeChange";
import Search from "../global/search";

function Header() {
  const { totalQuantity } = useSelector((state) => state.products);
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(
    document.documentElement.dataset.theme || "light"
  );
  const [settingTab, setSettingTab] = useState(false);
  const settingsRef = useRef(null);
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.dataset.theme || "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const handleThemeChange = () => {
    changetheme();
    setTheme(
      document.documentElement.dataset.theme === "dark" ? "light" : "dark"
    );
    setSettingTab(false);
  };
  const changeLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "tr" : "en");
    localStorage.setItem("lang", i18n.language);
    setSettingTab(false);
    toast.success(`Dil değiştirildi.`, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const goToAdmin = () => {
    const url = "/admin/login";
    window.open(url, "_blank");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setSettingTab(false);
      }
    };

    if (settingTab) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [settingTab]);

  return (
    <div className="flex items-center justify-between p-2 shadow-lg">
      <div>
        <h3 className="logo" onClick={() => navigate("/")}>
          E-COM
        </h3>
      </div>
      <div className="flex items-center w-lg border-b-1">
        <Search />
      </div>
      <div className="relative flex items-center justify-center">
        <button onClick={goToAdmin} className="btn-primary uppercase">
          <RiAdminFill size={20} />
        </button>
        <button
          className="btn-primary uppercase"
          onClick={() => setSettingTab(!settingTab)}
        >
          <FiSettings size={20} />
        </button>
        {settingTab && (
          <div
            ref={settingsRef}
            className="settingsTab bg-gray-300 dark:bg-gray-700 rounded-xl flex flex-col w-[250px] p-3 z-40 absolute right-0 top-full mt-2"
          >
            <button
              onClick={handleThemeChange}
              className="btn-primary uppercase flex justify-center items-center"
            >
              {/* {theme === "dark" ? t("lightMode") : t("darkMode")} */}
              {theme === "dark" ? (
                <MdOutlineLightMode size={15} />
              ) : (
                <MdDarkMode size={15} />
              )}
            </button>
            <button
              className="btn-primary flex justify-center items-center"
              onClick={changeLanguage}
            >
              {i18n.language === "en" ? "TR" : "EN"}
              {/* <HiLanguage size={15} /> */}
            </button>
          </div>
        )}

        <button className="btn-primary flex " onClick={() => navigate("/cart")}>
          <IoMdBasket size={20} />

          {totalQuantity !== 0 ? totalQuantity : ""}
        </button>
      </div>
    </div>
  );
}

export default Header;
