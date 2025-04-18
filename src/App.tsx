import { useContext } from "react";
import Content from "./components/Content";
import Sidebar from "./components/Sidebar";
import { AppContext } from "./contexts/AppContext";

function App() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("Context is not loaded properly.");
    }
    const { hide } = context;

    return (
        <main>
            <Content />
            {!hide && (<Sidebar />)}
        </main>
    );
}

export default App;
