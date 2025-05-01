import { useContext } from "react";
import Content from "./components/Content";
import Sidebar from "./components/Sidebar";
import { AppContext } from "./contexts/AppContext";
import Announcements from "./components/Announcements";
import { useTranslation } from "react-i18next";
function App() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("Context is not loaded properly.");
    }
    const { hide, hideAnnouncements } = context;

    const { i18n } = useTranslation();
    const lang = i18n.language;

    return (
        <main className={`app-${lang}`} id="app">
            <Content />
            {!hide && <Sidebar />}
            {!hideAnnouncements && <Announcements />}
        </main>
    );
}

export default App;
