import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { SceneContext } from "../../contexts/SceneContext";
import Crash from "../Crash";
import { SoftErrorContext } from "../../contexts/SoftErrorContext";
import { SettingsContext } from "../../contexts/SettingsContext";

const Experimental: React.FC = () => {
    const { t, i18n } = useTranslation();
    const scene = useContext(SceneContext);
    const settings = useContext(SettingsContext);
    const softError = useContext(SoftErrorContext);
    const [crash, setCrash] = useState(false);

    if (!scene || !softError || !settings) throw new Error("Context not found");
    const { setErrorInformation } = softError;
    const { loading, setLoading } = settings;

    
    return (
        <div className="option">
            <h1>{t("experimental.header")}</h1>
            <p>This experimental section is only used for testing.</p>
            <p>You can disable this on Settings.</p>
            
            <div className="option">
                <h2>Language</h2>
                <div className="option__content">
                    <select
                        value={i18n.language}
                        onChange={(e) => i18n.changeLanguage(e.target.value)}
                    >
                        {Object.keys(i18n.options.resources || {}).map(
                            (lng) => (
                                <option key={lng} value={lng}>
                                    {lng}
                                </option>
                            )
                        )}
                    </select>
                </div>
            </div>
            <div className="option">
                <h2>Loading</h2>
                <p>{loading}</p>
                <input
                    type="range"
                    name="loading"
                    id="loading"
                    min={0}
                    max={100}
                    value={loading}
                    onChange={(e) => {
                        setLoading(Number(e.target.value));
                    }}
                />
            </div>
            <div className="option">
                <h2>Error</h2>
                <div className="option__content">
                    <button
                        className="btn-regular btn-100 btn-white"
                        onClick={() => {
                            const msg = [
                                "Authentication failure or unable to access server.\nPlease check your internet connection and try again later.\nIf this issue persists, please check the FAQ for solutions.",
                                "Room disbanded. (103)",
                            ];
                            setErrorInformation(
                                msg[Math.floor(Math.random() * msg.length)]
                            );
                        }}
                    >
                        Soft error
                    </button>
                </div>
                <div className="option__content">
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
