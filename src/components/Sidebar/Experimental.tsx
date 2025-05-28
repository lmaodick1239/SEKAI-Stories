import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { refreshCanvas } from "../../utils/RefreshCanvas";
import { SceneContext } from "../../contexts/SceneContext";
import Crash from "../Crash";

const Experimental: React.FC = () => {
    const { t, i18n } = useTranslation();
    const scene = useContext(SceneContext);
    const [crash, setCrash] = useState(false);

    if (!scene) return;

    const handleRefresh = () => {
        refreshCanvas(scene);
    };
    return (
        <div className="option">
            <h1>{t("experimental.header")}</h1>
            <p>This experimental section is only used for testing.</p>
            <p>You can disable this on Settings.</p>
            <div className="option">
                <div className="option__content">
                    <button
                        className="btn-regular btn-blue btn-100"
                        onClick={handleRefresh}
                    >
                        {t("experimental.refresh")}
                    </button>
                    <p>{t("experimental.details")}</p>
                </div>
            </div>
            <div className="option">
                <h2>Language</h2>
                <div className="option__content">
                    <select
                        value={i18n.language}
                        onChange={(e) => i18n.changeLanguage(e.target.value)}
                    >
                        {Object.keys(i18n.options.resources || {}).map((lng) => (
                            <option key={lng} value={lng}>
                                {lng}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="option">
                <div className="option__conte">
                    <button
                        className="btn-regular btn-100 btn-red"
                        onClick={() => {
                            setCrash(true);
                        }}
                    >
                        CRASH
                    </button>
                    {crash && <Crash />}
                    <p>
                        Intentionally crashes the site. Please save your work
                        before doing so. Was used for test auto-save as it
                        crashes.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Experimental;
