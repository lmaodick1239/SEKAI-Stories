import React, { useContext } from "react";
import { SceneContext } from "../contexts/SceneContext";
import * as PIXI from "pixi.js";
import { refreshCanvas } from "../utils/RefreshCanvas";
import { useTranslation } from "react-i18next";
import ExportButton from "./ExportButton";

const DownloadClearButtons: React.FC = () => {
    const { t } = useTranslation();

    const context = useContext(SceneContext);

    if (!context) {
        return;
    }

    const { app, reset, setReset, guideline, setGuideline } = context;

    const handleSave = () => {
        if (guideline) {
            guideline.container.visible = false;
            setGuideline({
                ...guideline,
                visible: false,
            });
        }
        const region = new PIXI.Rectangle(0, 0, 1920, 1080);
        const texture = app?.renderer.generateTexture(app.stage, { region });
        const dataURL = app?.renderer.plugins.extract.image(texture).src;

        const a = document.createElement("a");
        a.href = dataURL;
        a.download = "canvas.png";
        document.body.append(a);
        a.click();
        a.remove();

        refreshCanvas(context);
    };

    const handleReset = () => {
        const confirmation = confirm(t("clear"));
        if (!confirmation) return;
        setReset(reset + 1);
    };

    return (
        <div
            className="absolute bottom-left flex-vertical"
            id="download-clear-buttons"
        >
            <button className="btn-circle btn-blue" onClick={handleSave}>
                <i className="bi bi-camera-fill sidebar__select"></i>
            </button>
            <ExportButton />
            <button className="btn-circle btn-white" onClick={handleReset}>
                <i className="bi bi-trash-fill sidebar__select"></i>
            </button>
        </div>
    );
};

export default DownloadClearButtons;
