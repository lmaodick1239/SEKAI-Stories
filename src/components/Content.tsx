import React from "react";
import Canvas from "./Canvas";
import SidebarSelect from "./SidebarSelect";
import DownloadClearButtons from "./DownloadClearButtons";

const Content: React.FC = () => {
    return (
        <div id="content" className="center" style={{ position: "relative" }}>
            <SidebarSelect />
            <DownloadClearButtons />
            <Canvas />
        </div>
    );
};

export default Content;
