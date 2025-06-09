import { useContext, useEffect } from "react";
import Content from "./components/Content";
import Sidebar from "./components/Sidebar";
import Announcements from "./components/UI/Announcements";
import { useTranslation } from "react-i18next";
import { ErrorBoundary } from "react-error-boundary";
import { SidebarContext } from "./contexts/SidebarContext";
import { SceneContext } from "./contexts/SceneContext";

function App() {
    const sidebar = useContext(SidebarContext);
    if (!sidebar) {
        throw new Error("Context is not loaded properly.");
    }
    const { hide, hideAnnouncements, allowRefresh } = sidebar;

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

    return (
        <ErrorBoundary fallbackRender={(props) => <ErrorFallback {...props} />}>
            <main className={`app-${lang}`} id="app">
                <Content />
                {!hide && <Sidebar />}
                {!hideAnnouncements && <Announcements />}
            </main>
        </ErrorBoundary>
    );
}

function ErrorFallback({ error }: { error: Error }) {
    const scene = useContext(SceneContext);
    const sidebar = useContext(SidebarContext);
    if (!scene || !sidebar) throw new Error("Context not prepared.");
    const { sceneJson } = scene;
    const { setAllowRefresh } = sidebar;

    useEffect(() => {
        localStorage.setItem("autoSave", JSON.stringify(sceneJson));
    }, [sceneJson]);

    setAllowRefresh(true);

    return (
        <div className="app-en center flex-vertical full-screen padding-20">
            <img src="/img/gomen.png" id="error-img" />
            <h1>...gomen...</h1>
            <p className="text-center">An unexpected error has occured.</p>
            <p className="text-center">
                We're really sorry for the inconvenience. Please refresh the
                page and try again.
            </p>
            <p className="text-center">
                If the problem persists, please report this issue on GitHub.
            </p>
            <p className="text-center">
                Your work is automatically saved. You can get it back from
                Settings.
            </p>
            <textarea
                readOnly
                value={`Traceback: \n${error.stack} \n\n${error.message}`}
                id="error-traceback"
            ></textarea>
            <button
                className="btn-blue btn-regular"
                onClick={() => {
                    navigator.clipboard.writeText(
                        `Traceback: \n${error.stack} \n\n${error.message}`
                    );
                    alert("Copied to clipboard!");
                }}
            >
                Copy
            </button>
            <button
                onClick={() =>
                    window.open(
                        "https://github.com/lezzthanthree/SEKAI-Stories/blob/master/README.md#report-an-issue",
                        "_blank"
                    )
                }
                className="btn-regular btn-pink"
            >
                Report
            </button>
        </div>
    );
}

export default App;
