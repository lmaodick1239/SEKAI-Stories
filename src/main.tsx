import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AppProvider } from "./contexts/AppProvider.tsx";
import i18nInit from "./utils/i18ninit.tsx";
import i18n from "i18next";
import { I18nextProvider } from "react-i18next";
import "./css/main.css";

i18nInit();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AppProvider>
            <I18nextProvider i18n={i18n}>
                <App />
            </I18nextProvider>
        </AppProvider>
    </StrictMode>
);
