import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AppProvider } from "./contexts/AppProvider.tsx";
import { Analytics } from "@vercel/analytics/react";
import "./css/main.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AppProvider>
            <App />
            <Analytics />
        </AppProvider>
    </StrictMode>
);
