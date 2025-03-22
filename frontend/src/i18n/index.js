import en from "./en.js";
import tr from "./tr.js";

const i18nsettings = {
  resources: {
    en,
    tr,
  },
  lng: localStorage.getItem("lang") || "en",
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
};

export default i18nsettings;
