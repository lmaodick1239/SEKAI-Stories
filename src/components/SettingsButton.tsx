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
    const languages = [{ code: "en", name: "English" }];

    return (
        <div id="support-button">
            <button
                className="btn-circle btn-white"
                onClick={() => {
                    setShow(true);
                }}
            >
                <i className="bi bi-translate sidebar__select"></i>
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
                            <div className="flex-horizontal space-between">
                                <h1>{t("settings")}</h1>
                            </div>
                            <h2>{t("Language")}</h2>
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
