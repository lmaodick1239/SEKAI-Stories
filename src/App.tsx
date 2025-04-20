import { useContext } from "react";
import Content from "./components/Content";
import Sidebar from "./components/Sidebar";
import { AppContext } from "./contexts/AppContext";
import Announcements from "./components/Announcements";

function App() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("Context is not loaded properly.");
    }
    const { hide, hideAnnouncements } = context;

    return (
        <main>
            <Content />
            {!hide && <Sidebar />}
            {!hideAnnouncements && <Announcements />}
        </main>
    );
}

export default App;
