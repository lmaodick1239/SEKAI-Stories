import React, { useContext } from "react";
import TextSidebar from "./Sidebar/TextSidebar";
import { SceneContext } from "../contexts/SceneContext";
import BackgroundSidebar from "./Sidebar/BackgroundSidebar";
import ModelSidebar from "./Sidebar/ModelSidebar";
import { refreshCanvas } from "../utils/RefreshCanvas";
import { useTranslation } from "react-i18next";

const Sidebar: React.FC = () => {
    const { t } = useTranslation();
    const context = useContext(SceneContext);

    if (!context) return;

    const { openedSidebar, startingMessage, showExperimental } = context;

    const handleRefresh = () => {
        refreshCanvas(context);
    };
    return (
        <div id="sidebar">
            {openedSidebar == "background" && <BackgroundSidebar />}
            {openedSidebar == "text" && <TextSidebar />}
            {openedSidebar == "model" && <ModelSidebar />}
            {startingMessage && <p>{startingMessage}</p>}
            {showExperimental && (
                <div className="option">
                    <h1>{t("experimental.header")}</h1>
                    <button
                        className="btn-regular btn-blue btn-100"
                        onClick={handleRefresh}
                    >
                        {t("experimental.refresh")}
                    </button>
                    <p>{t("experimental.details")}</p>
                    
                </div>
            )}
        </div>
    );
};

export default Sidebar;
