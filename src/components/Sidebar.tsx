import React, { useContext } from "react";
import TextSidebar from "./Sidebar/TextSidebar";
import { AppContext } from "../contexts/AppContext";
import BackgroundSidebar from "./Sidebar/BackgroundSidebar";
import ModelSidebar from "./Sidebar/ModelSidebar";
import { refreshCanvas } from "../utils/RefreshCanvas";
import { useTranslation } from "react-i18next";

const Sidebar: React.FC = () => {
    const { t } = useTranslation();
    const context = useContext(AppContext);

    if (!context) return;

    const { openedSidebar, startingMessage } = context;

    const handleRefresh = () => {
        refreshCanvas(context);
    };
    return (
        <div id="sidebar">
            {openedSidebar == "background" && <BackgroundSidebar />}
            {openedSidebar == "text" && <TextSidebar />}
            {openedSidebar == "model" && <ModelSidebar />}
            {startingMessage && <p>{startingMessage}</p>}
            <h1>{t("experimental")}</h1>
            <div className="option">
                <button
                    className="btn-regular btn-blue btn-100"
                    onClick={handleRefresh}
                >
                    {t("refresh")}
                </button>
                <p>
                    {t("experimental-details")}
                </p>
            </div>
        </div>
    );
};

export default Sidebar;
