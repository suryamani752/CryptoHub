import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "remixicon/fonts/remixicon.css";
import { CryptoProvider } from "./context/CryptoContext";
import { ThemeProvider } from "./context/ThemeContext";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

createRoot(document.getElementById("root")).render(
  <I18nextProvider i18n={i18n}>
    <ThemeProvider>
      <CryptoProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CryptoProvider>
    </ThemeProvider>
  </I18nextProvider>
);
