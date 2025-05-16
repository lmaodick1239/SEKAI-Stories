import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const SupportButton: React.FC = () => {
    const { t } = useTranslation();

    const [show, setShow] = useState<boolean>(false);

    return (
        <div className="absolute top-right" id="support-button">
            <button
                className="btn-circle btn-orange"
                onClick={() => setShow(true)}
            >
                <i className="bi bi-suit-heart-fill sidebar__select"></i>
            </button>
            {show && (
                <div
                    id="support-screen"
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
                            <h1>{t("support.header")}</h1>
                            <p>{t("support.details")}</p>
                            <h2>Ko-fi</h2>
                            <p>{t("support.ko-fi-details")}</p>
                            <a
                                href="https://ko-fi.com/smiliepop"
                                target="_blank"
                            >
                                <img src="/img/kofi.jpg" alt="ko-fi" />
                            </a>
                            <h2>GitHub</h2>
                            <p>{t("support.github-details")}</p>
                            <a
                                href="https://github.com/lezzthanthree/SEKAI-Stories"
                                target="_blank"
                            >
                                <img src="/img/github.jpg" alt="github" />
                            </a>
                            <p></p>
                            <p></p>
                            <h1>{t("support.special-thanks-header")}</h1>
                            <p>{t("support.special-thanks-description")}</p>
                            <a href="https://sekai.best" target="_blank">
                                <img
                                    src="/img/sekai-viewer.png"
                                    alt="sekai-viewer"
                                />
                            </a>
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

export default SupportButton;
