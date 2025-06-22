import { useContext, useEffect } from "react";
import Content from "./components/Content";
import Sidebar from "./components/Sidebar";
import Announcements from "./components/UI/Announcements";
import { useTranslation } from "react-i18next";
import { SettingsContext } from "./contexts/SettingsContext";
import { useAudioManager } from "./utils/useAudioManager";

function App() {
    const { playSound } = useAudioManager();
    const settings = useContext(SettingsContext);
    if (!settings) {
        throw new Error("Context is not loaded properly.");
    }
    const { hide, hideAnnouncements, allowRefresh } = settings;

    const { i18n } = useTranslation();
    const lang = i18n.language;

    useEffect(() => {
        if (!allowRefresh) {
            window.onbeforeunload = (e) => {
                e.preventDefault();
            };
        } else {
            window.onbeforeunload = null;
        }
        return () => {
            window.onbeforeunload = null;
        };
    }, [allowRefresh]);

    useEffect(() => {
        const handleButtonClick = (e: MouseEvent) => {
            // console.log("pop!")
            const target = e.target as HTMLElement;
            if (
                target.closest(".close-button") ||
                target.closest(".middle-information-div") ||
                target.closest("label") ||
                target.closest("input[type='file']") ||
                target.closest("a")
            )
                return;
            playSound("/sound/select.wav")
        };

        document.addEventListener("click", handleButtonClick, true);

        return () => {
            document.removeEventListener("click", handleButtonClick);
        };
    }, []);

    return (
        <main className={`app-${lang}`} id="app">
            <Content />
            {!hide && <Sidebar />}
            {!hideAnnouncements && <Announcements />}
        </main>
    );
}

export default App;
