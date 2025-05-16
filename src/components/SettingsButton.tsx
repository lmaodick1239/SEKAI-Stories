import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import SupportButton from "./SupportButton";

const SettingsButton: React.FC = () => {
    const { t, i18n } = useTranslation();

    const lng = i18n.language;

    const [show, setShow] = useState<boolean>(false);

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
                <div
                    id="settings-screen"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShow(false);
                    }}
                >
                    <div
                        className="window"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="window__content">
                            <SupportButton />
                            <h1>{t("settings.header")}</h1>
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
                            <h2>{t("settings.auto-save")}</h2>
                            <p>{t("settings.auto-save-description")}</p>
                            <button
                                className="btn-blue btn-extend-width btn-regular"
                                onClick={handleGetAutoSaveData}
                            >
                                {t("settings.auto-save-button")}
                            </button>
                        </div>
                        <div className="extend-width center">
                            <button
                                className="btn-regular btn-white center"
                                onClick={() => setShow(false)}
                            >
                                {t("close")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsButton;
