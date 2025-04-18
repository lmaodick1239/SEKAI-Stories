import React, { useContext } from "react";
import { AppContext } from "../contexts/AppContext";

const SidebarSelect: React.FC = () => {
    const context = useContext(AppContext);

    if (!context) return;

    const { openedSidebar, setOpenedSidebar } = context;

    return (
        <div className="absolute flex-vertical" id="sidebar-select">
            <button
                onClick={() => {
                    setOpenedSidebar("background");
                }}
                className={`btn-circle ${
                    openedSidebar == "background" ? "btn-orange" : "btn-white"
                }`}
            >
                <i className="sidebar__select bi bi-card-image"></i>
            </button>
            <button
                onClick={() => {
                    setOpenedSidebar("text");
                }}
                className={`btn-circle ${
                    openedSidebar == "text" ? "btn-orange" : "btn-white"
                }`}
            >
                <i className="sidebar__select bi bi-chat"></i>
            </button>
            <button
                onClick={() => {
                    setOpenedSidebar("model");
                }}
                className={`btn-circle ${
                    openedSidebar == "model" ? "btn-orange" : "btn-white"
                }`}
            >
                <i className="sidebar__select bi bi-person-fill"></i>
            </button>
        </div>
    );
};

export default SidebarSelect;
