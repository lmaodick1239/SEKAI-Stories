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

    if (!context) {
        throw new Error("Context is not loaded properly.");
    }
    const { hide, setHide } = context;

    return (
        <div id="content" className="center" style={{ position: "relative" }}>
            <div id="content-background" ref={contentBackground}></div>

            {!hide && <SidebarSelect />}
            <DownloadClearButtons />
            <div className="absolute bottom-right">
                <button
                    className={`btn-circle ${hide ? "btn-pink" : "btn-white"}`}
                    onClick={() => {
                        setHide(!hide);
                    }}
                >
                    {hide ? (
                        <i className="sidebar__select bi bi-chevron-left" />
                    ) : (
                        <i className="sidebar__select bi bi-chevron-right" />
                    )}
                </button>
            </div>
            <Canvas />
        </div>
    );
};

export default Content;
