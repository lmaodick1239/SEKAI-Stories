import React, { useContext } from "react";
import TextSidebar from "./Sidebar/TextSidebar";
import { AppContext } from "../contexts/AppContext";
import BackgroundSidebar from "./Sidebar/BackgroundSidebar";
import ModelSidebar from "./Sidebar/ModelSidebar";
import { refreshCanvas } from "../utils/RefreshCanvas";

const Sidebar: React.FC = () => {
    const context = useContext(AppContext);

    if (!context) return;

    const { openedSidebar } = context;

    const handleRefresh = () => {
        refreshCanvas(context);
    };
    return (
        <div id="sidebar">
            {openedSidebar == "background" && <BackgroundSidebar />}
            {openedSidebar == "text" && <TextSidebar />}
            {openedSidebar == "model" && <ModelSidebar />}
            <h1>Experimental</h1>
            <div className="option">
                    <button
                        className="btn-regular btn-blue btn-100"
                        onClick={handleRefresh}
                    >
                        Refresh
                    </button>
                    <p>
                        If you don't see any changes, you may try refreshing the
                        canvas.
                    </p>
            </div>
        </div>
    );
};

export default Sidebar;
