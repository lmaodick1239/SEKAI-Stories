import React, { useContext } from "react";
import TextSidebar from "./Sidebar/TextSidebar";
import { SceneContext } from "../contexts/SceneContext";
import BackgroundSidebar from "./Sidebar/BackgroundSidebar";
import ModelSidebar from "./Sidebar/ModelSidebar";
import { SidebarContext } from "../contexts/SidebarContext";
import Experimental from "./Sidebar/Experimental";

const Sidebar: React.FC = () => {
    const scene = useContext(SceneContext);
    const sidebar = useContext(SidebarContext);

    if (!scene || !sidebar) return;

    const { startingMessage } = scene;
    const { openedSidebar, showExperimental } = sidebar;

    return (
        <div id="sidebar">
            {openedSidebar == "background" && <BackgroundSidebar />}
            {openedSidebar == "text" && <TextSidebar />}
            {openedSidebar == "model" && <ModelSidebar />}
            {startingMessage && <p>{startingMessage}</p>}
            {showExperimental && <Experimental />}
        </div>
    );
};

export default Sidebar;
