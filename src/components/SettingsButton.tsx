import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import SupportButton from "./SupportButton";
import { Checkbox } from "./UI/Checkbox";
import { SceneContext } from "../contexts/SceneContext";
import { SidebarContext } from "../contexts/SidebarContext";
import Window from "./UI/Window";

const SettingsButton: React.FC = () => {
    const { t, i18n } = useTranslation();
    const lng = i18n.language;
    const [show, setShow] = useState<boolean>(false);

    const scene = useContext(SceneContext);
    const sidebar = useContext(SidebarContext);

    if (!scene || !sidebar) {
        throw new Error("Context not provided.");
    }

    const { guideline, setGuideline } = scene;
    const {
        openAll,
        setOpenAll,
        showExperimental,
        setShowExperimental,
        setShowTutorial,
    } = sidebar;

    const handleChangeLanguage = async (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const languangeToChange = event.target.value;

        i18n.changeLanguage(languangeToChange);
        localStorage.setItem("language", languangeToChange);
    };
    const languages = [
        { code: "en", name: "English" },
        { code: "es", name: "Español" },
        { code: "pl", name: "Polski" },
        { code: "fil", name: "Filipino" },
        { code: "cn", name: "简体中文" },
    ];

    const handleGetAutoSaveData = () => {
        const data = localStorage.getItem("autoSave");
        if (!data) {
            alert("No auto-save data found.");
            return;
        }
        const jsonParsed = JSON.parse(data);
        const jsonString = JSON.stringify(jsonParsed, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "autoSave.json";
        a.click();
        a.remove();
    };

    const handleGuideline = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked;
        if (guideline) {
            guideline.container.visible = value;
            setGuideline({
                ...guideline,
                visible: value,
            });
        }
    };

    const handleExperimental = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked;
        if (
            value &&
            !confirm(
                "This is only used for testing and other experimental features. Continue?"
            )
        ) {
            return;
        }
        localStorage.setItem("showExperimental", String(value));
        setShowExperimental(value);
    };

    const handleExpand = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked;
        localStorage.setItem("openAll", String(value));
        setOpenAll(value);
    };

    return (
        <div id="support-button">
            <button
                className="btn-circle btn-white"
                onClick={() => {
                    setShow(true);
                }}
            >
                <i className="bi bi-gear-fill sidebar__select"></i>
            </button>
            {show && (
                <Window show={setShow}>
                    <div className="window__content">
                        <SupportButton />
                        <h1>{t("settings.header")}</h1>
                        <div className="window__divider">
                            <h2>{t("settings.language")}</h2>
                            <select
                                name="language"
                                id="language"
                                value={lng}
                                onChange={handleChangeLanguage}
                            >
                                {languages.map((language) => (
                                    <option
                                        key={language.code}
                                        value={language.code}
                                    >
                                        {language.name}
                                    </option>
                                ))}
                            </select>
                            <a
                                href="https://github.com/lezzthanthree/SEKAI-Stories/blob/master/README-localization.md"
                                target="_blank"
                            >
                                Contribute for localization!
                            </a>
                        </div>
                        <div className="window__divider">
                            <h2>{t("settings.auto-save")}</h2>
                            <p>{t("settings.auto-save-description")}</p>
                            <button
                                className="btn-blue btn-extend-width btn-regular"
                                onClick={handleGetAutoSaveData}
                            >
                                {t("settings.auto-save-button")}
                            </button>
                        </div>
                        <div className="window__divider">
                            <h2>{t("settings.tutorial")}</h2>
                            <button
                                className="btn-blue btn-extend-width btn-regular"
                                onClick={() => {
                                    setShowTutorial(true)
                                    setShow(false)
                                }}
                            >
                                {t("settings.show-tutorial")}
                            </button>
                        </div>
                        <div className="window__divider">
                            <h2>{t("settings.toggles")}</h2>
                            <Checkbox
                                id="expand"
                                label={t("settings.expand")}
                                checked={openAll}
                                onChange={handleExpand}
                            />
                            <Checkbox
                                id="guideline"
                                label={t("settings.guidelines")}
                                checked={guideline?.visible}
                                onChange={handleGuideline}
                            />
                            <Checkbox
                                id="experimental"
                                label={t("settings.experimental")}
                                checked={showExperimental}
                                onChange={handleExperimental}
                            />
                        </div>
                    </div>
                </Window>
            )}
        </div>
    );
};

export default SettingsButton;
