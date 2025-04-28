import React, { useContext } from "react";
import { AppContext } from "../contexts/AppContext";
import * as PIXI from "pixi.js";
import { refreshCanvas } from "../utils/RefreshCanvas";
import { useTranslation } from "react-i18next";

const DownloadClearButtons: React.FC = () => {
    const { t } = useTranslation();

    const context = useContext(AppContext);

    if (!context) {
        return;
    }

    const { app, reset, setReset } = context;

    const handleSave = () => {
        // const region = app?.stage.getBounds();
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
                <i className="bi bi-floppy2-fill sidebar__select"></i>
            </button>
            <button className="btn-circle btn-white" onClick={handleReset}>
                <i className="bi bi-trash-fill sidebar__select"></i>
            </button>
        </div>
    );
};

export default DownloadClearButtons;
