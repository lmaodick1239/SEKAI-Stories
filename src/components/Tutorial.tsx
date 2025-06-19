import React, {
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import Window from "./UI/Window";
import { useTranslation } from "react-i18next";
import { handleChangeLanguage, languageNames } from "../utils/i18ninit";
import * as PIXI from "pixi.js";
import { SceneContext } from "../contexts/SceneContext";

interface TutorialProps {
    show: Dispatch<SetStateAction<boolean>>;
}

const Tutorial: React.FC<TutorialProps> = ({ show }) => {
    const scene = useContext(SceneContext);
    if (!scene) throw new Error("Context not found");
    const { text, setText } = scene;
    const [textContainer, setTextContainer] = useState<PIXI.Container | null>(
        null
    );
    const [yOffset, setYOffset] = useState<number>(text?.yOffset ?? 0);
    const [page, setPage] = useState<number>(-2);
    const { t, i18n } = useTranslation();
    const lng = i18n.language;
    const offsetCanvas = useRef<HTMLCanvasElement | null>(null);

    const handleYOffsetChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = Number(event.target.value);
        localStorage.setItem("textAlignment", String(value));

        if (textContainer) {
            textContainer.y = 0 + value;
        }
        if (text) {
            text.nameTag.y = 780 + value;
            text.dialogue.y = 845 + value;
            setText({
                ...text,
                yOffset: value,
            });
        }
        setYOffset(value);
    };

    useEffect(() => {
        const render = async () => {
            const initApplication = new PIXI.Application({
                view: offsetCanvas.current as HTMLCanvasElement,
                autoStart: true,
                width: 660,
                height: 250,
                backgroundColor: 0x000000,
            });
            const testContainer = new PIXI.Container();
            const testTexture = await PIXI.Texture.fromURL(
                "/img/canvas-test.png"
            );
            const testSprite = new PIXI.Sprite(testTexture);
            testContainer.addChild(testSprite);
            initApplication.stage.addChildAt(testContainer, 0);

            const textContainer = new PIXI.Container();
            const textNameTag = new PIXI.Text("Align me here!", {
                fontFamily: "FOT-RodinNTLGPro-EB",
                fontSize: 44,
                fill: 0xebebef,
                stroke: 0x5d5d79,
                strokeThickness: 8,
            });
            textNameTag.position.set(46, 54);
            const textDialogue = new PIXI.Text("Lorem ipsum dolor", {
                fontFamily: "FOT-RodinNTLGPro-DB",
                fontSize: 44,
                fill: 0xffffff,
                stroke: 0x5d5d79,
                strokeThickness: 8,
                wordWrap: true,
                wordWrapWidth: 1300,
                breakWords: true,
                lineHeight: 55,
            });
            textDialogue.position.set(67, 119);

            textContainer.addChildAt(textNameTag, 0);
            textContainer.addChildAt(textDialogue, 1);
            textContainer.y = 0 + yOffset;
            setTextContainer(textContainer);

            initApplication.stage.addChildAt(textContainer, 1);
        };
        if (page == -1 && offsetCanvas.current) {
            render();
        }
    }, [page]);

    return (
        <>
            {page == -2 && (
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
                        <h1>{t("text.y-offset")}</h1>
                        <p>
                            Adjust the slider until you don't see any red spots.
                        </p>
                        <p>You can always change this back on the Text Menu.</p>
                        <canvas
                            height={250}
                            width={660}
                            ref={offsetCanvas}
                            id="canvas-test"
                        />
                        <input
                            type="range"
                            min="-20"
                            max="20"
                            value={yOffset}
                            onChange={handleYOffsetChange}
                        />
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
                        <div className="window__divider center padding-top-bottom-10">
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
                        <div className="window__divider center padding-top-bottom-10">
                            <img
                                src="/img/menu2.png"
                                className="outline-blue-4"
                                alt=""
                            />
                        </div>
                        <div className="window__divider">
                            <h2>{t("tutorial.selectUploadHeader")}</h2>
                            <p>{t("tutorial.selectUploadParagraph")}</p>
                            <div className="window__divider center">
                                <img
                                    src="/img/menu2-1.png"
                                    className="outline-blue-4 center"
                                    alt=""
                                />
                            </div>
                        </div>
                        <div className="window__divider">
                            <h2>{t("tutorial.splitLocationHeader")}</h2>
                            <p>{t("tutorial.splitLocationParagraph")}</p>
                            <div className="window__divider center">
                                <img
                                    src="/img/menu2-2.png"
                                    className="outline-blue-4 center"
                                    alt=""
                                />
                            </div>
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
                        <div className="window__divider center padding-top-bottom-10">
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
                            <div className="window__divider center">
                                <img
                                    src="/img/menu3-1.png"
                                    className="outline-blue-4 center"
                                    alt=""
                                />
                            </div>
                        </div>
                        <div className="window__divider">
                            <h2>{t("tutorial.sceneTextHeader")}</h2>
                            <p>{t("tutorial.sceneTextParagraph")}</p>
                            <div className="window__divider center">
                                <img
                                    src="/img/menu3-2.png"
                                    className="outline-blue-4 center"
                                    alt=""
                                />
                            </div>
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
                        <div className="window__divider center padding-top-bottom-10">
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
                            <div className="window__divider center">
                                <img
                                    src="/img/menu4-1.png"
                                    className="outline-blue-4 center"
                                    alt=""
                                />
                            </div>
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
                            <div className="window__divider center">
                                <img
                                    src="/img/menu4-2.png"
                                    className="outline-blue-4 center"
                                    alt=""
                                />
                            </div>
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
                            <div className="window__divider center">
                                <img
                                    src="/img/menu4-3.png"
                                    className="outline-blue-4 center"
                                    alt=""
                                />
                            </div>
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
                        <div className="window__divider center padding-top-bottom-10">
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
