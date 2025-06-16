import React, { useContext, useEffect, useRef } from "react";
import Canvas from "./Canvas";
import SidebarSelect from "./SidebarSelect";
import DownloadClearButtons from "./DownloadClearButtons";
import { SceneContext } from "../contexts/SceneContext";
import FlavorText from "./FlavorText";
import SettingsButton from "./SettingsButton";
import { SidebarContext } from "../contexts/SidebarContext";
import Tutorial from "./Tutorial";

const Content: React.FC = () => {
    const contentBackground = useRef<HTMLDivElement | null>(null);
    const scene = useContext(SceneContext);
    const sidebar = useContext(SidebarContext);

    useEffect(() => {
        if (!scene || !scene.background) return;
        if (contentBackground.current) {
            contentBackground.current.style.backgroundImage = scene?.background
                .filename
                ? `url("${scene.background.filename}")`
                : "";
        }
    }, [scene]);

    window.addEventListener("scroll", function () {
        const scrollPosition = window.scrollY;
        const tabs = document.getElementById("sidebar-select");
        const save = document.getElementById("download-clear-buttons");
        const locale = document.getElementById("settings");
        const hideAtPosition = 100;

        if (scrollPosition > hideAtPosition) {
            if (tabs) {
                tabs.style.opacity = "0";
                tabs.style.pointerEvents = "none";
            }
            if (save) {
                save.style.opacity = "0";
                save.style.pointerEvents = "none";
            }
            if (locale) {
                locale.style.opacity = "0";
                locale.style.pointerEvents = "none";
            }
        } else {
            if (tabs) {
                tabs.style.opacity = "1.0";
                tabs.style.pointerEvents = "auto";
            }
            if (save) {
                save.style.opacity = "1.0";
                save.style.pointerEvents = "auto";
            }
            if (locale) {
                locale.style.opacity = "1.0";
                locale.style.pointerEvents = "auto";
            }
        }
    });

    if (!scene || !sidebar) {
        throw new Error("Context is not loaded properly.");
    }
    const { hide, setHide, showTutorial, setShowTutorial } = sidebar;

    return (
        <div id="content" className="center" style={{ position: "relative" }}>
            <div id="content-background" ref={contentBackground}></div>
            {showTutorial && <Tutorial show={setShowTutorial} />}
            {!hide && <SidebarSelect />}
            <DownloadClearButtons />
            <div className="absolute bottom-right" id="hide-sidebar">
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
            <div className="absolute top-left" id="settings">
                <SettingsButton />
            </div>

            <Canvas />
            <FlavorText />
        </div>
    );
};

export default Content;
