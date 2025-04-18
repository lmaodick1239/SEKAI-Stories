import React, { useContext, useEffect, useRef } from "react";
import Canvas from "./Canvas";
import SidebarSelect from "./SidebarSelect";
import DownloadClearButtons from "./DownloadClearButtons";
import { AppContext } from "../contexts/AppContext";

const Content: React.FC = () => {
    const contentBackground = useRef<HTMLDivElement | null>(null);
    const context = useContext(AppContext);

    useEffect(() => {
        if (!context || !context.background) return;
        if (contentBackground.current) {
            contentBackground.current.style.backgroundImage = context
                ?.background.filename
                ? `url(${context.background.filename})`
                : "";
        }
    }, [context]);

    return (
        <div id="content" className="center" style={{ position: "relative" }}>
            <div id="content-background" ref={contentBackground}></div>
            <SidebarSelect />
            <DownloadClearButtons />
            <Canvas />
        </div>
    );
};

export default Content;
