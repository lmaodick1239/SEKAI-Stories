import React, { useContext, useState } from "react";
import { SceneContext } from "../contexts/SceneContext";
import * as PIXI from "pixi.js";
import { refreshCanvas } from "../utils/RefreshCanvas";
import { useTranslation } from "react-i18next";
import ExportButton from "./ExportButton";
import Window from "./Window";
import { SidebarContext } from "../contexts/SidebarContext";

const DownloadClearButtons: React.FC = () => {
    const [resetShow, setResetShow] = useState(false);
    const { t } = useTranslation();

    const scene = useContext(SceneContext);
    const sidebar = useContext(SidebarContext);

    if (!scene || !sidebar) {
        return;
    }

    const { app, reset, setReset, guideline, setGuideline } = scene;
    const { setAllowRefresh } = sidebar;

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

        refreshCanvas(scene);
        setAllowRefresh(true)
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
            <button
                className="btn-circle btn-white"
                onClick={() => setResetShow(true)}
            >
                <i className="bi bi-trash-fill sidebar__select"></i>
            </button>
            {resetShow && (
                <Window
                    show={setResetShow}
                    confirmFunction={() => setReset(reset + 1)}
                    confirmLabel={t("clear-ok")}
                    danger={true}
                >
                    <div className="window__content">
                        <p>{t("clear")}</p>
                    </div>
                </Window>
            )}
        </div>
    );
};

export default DownloadClearButtons;
