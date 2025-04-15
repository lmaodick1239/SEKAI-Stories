import React, { useContext } from "react";
import TextSidebar from "./Sidebar/TextSidebar";
import { AppContext } from "../contexts/AppContext";
import BackgroundSidebar from "./Sidebar/BackgroundSidebar";

const Sidebar: React.FC = () => {
    const context = useContext(AppContext);

    if (!context) return;

    const { openedSidebar } = context;

    return (
        <div id="sidebar">
            {openedSidebar == "background" && <BackgroundSidebar />}
            {openedSidebar == "text" && <TextSidebar />}
        </div>
    );
};

export default Sidebar;
