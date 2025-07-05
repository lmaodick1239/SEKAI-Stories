import React, { useContext, useState } from "react";
import { SceneContext } from "../contexts/SceneContext";
import * as PIXI from "pixi.js";
import { useTranslation } from "react-i18next";
import ExportButton from "./ExportButton";
import Window from "./UI/Window";
import { SettingsContext } from "../contexts/SettingsContext";
import { Checkbox } from "./UI/Checkbox";

const DownloadClearButtons: React.FC = () => {
    const [resetShow, setResetShow] = useState(false);
    const [saveWindowShow, setSaveWindowShow] = useState(false);
    const [saveData, setSaveData] = useState<string>("");
    const { t } = useTranslation();

    const scene = useContext(SceneContext);
    const settings = useContext(SettingsContext);

    if (!scene || !settings) {
        return;
    }

    const { app, reset, setReset, guideline, setGuideline } = scene;
    const { setAllowRefresh, showSaveDialog, setShowSaveDialog } = settings;

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
        setSaveData(dataURL);

        if (showSaveDialog) setSaveWindowShow(true);

        const a = document.createElement("a");
        a.href = dataURL;
        a.download = "canvas.png";
        document.body.append(a);
        a.click();
        a.remove();

        setAllowRefresh(true);
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
            {saveWindowShow && (
                <Window show={setSaveWindowShow}>
                    <div className="window__content">
                        <div className="windown__divider">
                            <h1>Save</h1>
                            <p>
                                {window.matchMedia("(pointer: fine)").matches
                                    ? t("save.note-1-desktop")
                                    : t("save.note-1-phone")}
                            </p>
                            <p>{t("save.note-2")}</p>
                            <img src={saveData} className="width-100" />
                        </div>
                        <div className="windown__divider center">
                            <Checkbox
                                id="stop-show"
                                label="Don't show dialog next time."
                                checked={!showSaveDialog}
                                onChange={(e) => {
                                    const value = e.currentTarget.value;
                                    setShowSaveDialog(!value);
                                }}
                            />
                        </div>
                    </div>
                </Window>
            )}
        </div>
    );
};

export default DownloadClearButtons;
