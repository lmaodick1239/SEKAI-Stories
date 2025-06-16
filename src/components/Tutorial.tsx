import React, { Dispatch, SetStateAction, useState } from "react";
import Window from "./UI/Window";
import { useTranslation } from "react-i18next";
import { handleChangeLanguage, languageNames } from "../utils/i18ninit";

interface TutorialProps {
    show: Dispatch<SetStateAction<boolean>>;
}

const Tutorial: React.FC<TutorialProps> = ({ show }) => {
    const [page, setPage] = useState<number>(-1);
    const { t, i18n } = useTranslation();
    const lng = i18n.language;

    return (
        <>
            {page == -1 && (
                <Window
                    show={show}
                    confirmLabel={t("next")}
                    confirmFunction={() => setPage(page + 1)}
                    skipCloseInConfirm
                    className="window__90_width"
                    hideClose
                >
                    <div className="window__content">
                        <h1>{t("settings.language")}</h1>
                        <select
                            name="language"
                            id="language"
                            value={lng}
                            onChange={handleChangeLanguage}
                        >
                            {Object.entries(languageNames).map(
                                ([code, name]) => (
                                    <option key={code} value={code}>
                                        {name}
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                </Window>
            )}
            {page == 0 && (
                <Window
                    show={show}
                    confirmLabel={t("tutorial.confirmFirstTime")}
                    confirmFunction={() => setPage(page + 1)}
                    skipCloseInConfirm
                >
                    <div className="window__content">
                        <h1 className="text-center">
                            {t("tutorial.welcomeHeader")}
                        </h1>
                        <div className="window__divider">
                            <h2 className="text-center">
                                {t("tutorial.welcomeIntroHeader")}
                            </h2>
                            <p className="text-center">
                                {t("tutorial.welcomeIntroParagraph1")}
                            </p>
                            <p className="text-center">
                                {t("tutorial.welcomeIntroParagraph2")}
                            </p>
                        </div>
                    </div>
                </Window>
            )}
            {page == 1 && (
                <Window
                    show={show}
                    confirmLabel={t("next")}
                    confirmFunction={() => setPage(page + 1)}
                    skipCloseInConfirm
                    hideClose
                >
                    <div className="window__content">
                        <h1 className="text-center">
                            {t("tutorial.menuNavigationHeader")}
                        </h1>
                        <div className="window__divider center">
                            <img
                                src="/img/menu1.png"
                                className="outline-blue-4"
                                alt=""
                            />
                        </div>
                    </div>
                </Window>
            )}
            {page == 2 && (
                <Window
                    show={show}
                    confirmLabel={t("next")}
                    confirmFunction={() => setPage(page + 1)}
                    skipCloseInConfirm
                    hideClose
                >
                    <div className="window__content">
                        <h1 className="text-center">
                            <i className="sidebar__select bi bi-card-image"></i>{" "}
                            {t("tutorial.backgroundMenuHeader")}
                        </h1>
                        <div className="window__divider center">
                            <img
                                src="/img/menu2.png"
                                className="outline-blue-4"
                                alt=""
                            />
                        </div>
                        <div className="window__divider">
                            <h2>{t("tutorial.selectUploadHeader")}</h2>
                            <p>{t("tutorial.selectUploadParagraph")}</p>
                        </div>
                        <div className="window__divider">
                            <h2>{t("tutorial.splitLocationHeader")}</h2>
                            <p>{t("tutorial.splitLocationParagraph")}</p>
                        </div>
                    </div>
                </Window>
            )}
            {page == 3 && (
                <Window
                    show={show}
                    confirmLabel={t("next")}
                    confirmFunction={() => setPage(page + 1)}
                    skipCloseInConfirm
                    hideClose
                >
                    <div className="window__content">
                        <h1 className="text-center">
                            <i className="sidebar__select bi bi-chat"></i>{" "}
                            {t("tutorial.textMenuHeader")}
                        </h1>
                        <div className="window__divider center">
                            <img
                                src="/img/menu3.png"
                                className="outline-blue-4"
                                alt=""
                            />
                        </div>
                        <div className="window__divider">
                            <h2>{t("tutorial.nameTagHeader")}</h2>
                            <p>{t("tutorial.nameTagParagraph")}</p>
                            <h3>{t("tutorial.easySwitchHeader")}</h3>
                            <p>{t("tutorial.easySwitchParagraph")}</p>
                        </div>
                        <div className="window__divider">
                            <h2>{t("tutorial.dialogueHeader")}</h2>
                            <p>{t("tutorial.dialogueParagraph")}</p>
                        </div>
                        <div className="window__divider">
                            <h2>{t("tutorial.sceneTextHeader")}</h2>
                            <p>{t("tutorial.sceneTextParagraph")}</p>
                        </div>
                    </div>
                </Window>
            )}
            {page == 4 && (
                <Window
                    show={show}
                    confirmLabel={t("next")}
                    confirmFunction={() => setPage(page + 1)}
                    skipCloseInConfirm
                    hideClose
                >
                    <div className="window__content">
                        <h1 className="text-center">
                            <i className="sidebar__select bi bi-person-fill"></i>{" "}
                            {t("tutorial.modelMenuHeader")}
                        </h1>
                        <div className="window__divider center">
                            <img
                                src="/img/menu4.png"
                                className="outline-blue-4"
                                alt=""
                            />
                        </div>
                        <div className="window__divider">
                            <h2>{t("tutorial.selectedLayerHeader")}</h2>
                            <p>{t("tutorial.selectedLayerParagraph")}</p>
                            <h3>
                                <i className="bi bi-plus-circle" />{" "}
                                {t("tutorial.addModelHeader")}
                            </h3>
                            <p>{t("tutorial.addModelParagraph")}</p>
                            <h3>
                                <i className="bi bi-upload" />{" "}
                                {t("tutorial.uploadSpriteHeader")}
                            </h3>
                            <p>{t("tutorial.uploadSpriteParagraph")}</p>
                            <h3>
                                <i className="bi bi-x-circle" />{" "}
                                {t("tutorial.removeLayerHeader")}
                            </h3>
                            <p>{t("tutorial.removeLayerParagraph")}</p>
                        </div>
                        <div className="window__divider">
                            <h2>{t("tutorial.transformHeader")}</h2>
                            <p>{t("tutorial.transformParagraph")}</p>
                        </div>
                        <div className="window__divider">
                            <h2>{t("tutorial.characterHeader")}</h2>
                            <p>{t("tutorial.characterParagraph")}</p>
                        </div>
                        <div className="window__divider">
                            <h2>{t("tutorial.costumeHeader")}</h2>
                            <p>{t("tutorial.costumeParagraph")}</p>
                        </div>
                        <div className="window__divider">
                            <h2>{t("tutorial.emotionHeader")}</h2>
                            <h3>{t("tutorial.poseHeader")}</h3>
                            <p>{t("tutorial.poseParagraph")}</p>
                            <h3>{t("tutorial.expressionHeader")}</h3>
                            <p>{t("tutorial.expressionParagraph")}</p>
                        </div>
                        <div className="window__divider">
                            <h2>{t("tutorial.mouthHeader")}</h2>
                            <p>{t("tutorial.mouthParagraph")}</p>
                        </div>
                        <div className="window__divider">
                            <h2>{t("tutorial.live2dHeader")}</h2>
                            <p>{t("tutorial.live2dParagraph")}</p>
                            <h3>{t("tutorial.importExportHeader")}</h3>
                            <p>{t("tutorial.importExportParagraph")}</p>
                        </div>
                    </div>
                </Window>
            )}
            {page == 5 && (
                <Window
                    show={show}
                    confirmLabel={t("next")}
                    confirmFunction={() => setPage(page + 1)}
                    skipCloseInConfirm
                    hideClose
                >
                    <div className="window__content">
                        <h1 className="text-center">
                            {t("tutorial.saveHeader")}
                        </h1>
                        <div className="window__divider center">
                            <img
                                src="/img/menu5.png"
                                className="outline-blue-4"
                                alt=""
                            />
                        </div>
                        <div className="window__divider">
                            <h2>
                                <i className="bi bi-braces" />{" "}
                                {t("tutorial.importExportHeader")}
                            </h2>
                            <p>{t("tutorial.sceneImportExportParagraph")}</p>
                        </div>
                    </div>
                </Window>
            )}
            {page == 6 && (
                <Window show={show}>
                    <div className="window__content">
                        <h1 className="text-center">
                            {t("tutorial.endHeader")}
                        </h1>
                        <div className="window__divider center flex-vertical">
                            <p className="text-center">
                                {t("tutorial.endParagraph")}
                            </p>
                            <img
                                className="center"
                                src="/img/iine.png"
                                alt=""
                            />
                        </div>
                    </div>
                </Window>
            )}
        </>
    );
};

export default Tutorial;
