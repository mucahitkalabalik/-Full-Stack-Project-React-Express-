import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import i18nsettings from "./i18n/index.js";
import { store } from './redux/store'
import { Provider } from 'react-redux'

i18n.use(initReactI18next).init(i18nsettings);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);