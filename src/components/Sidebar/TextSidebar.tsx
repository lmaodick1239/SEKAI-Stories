import React, { useContext, useEffect, useState } from "react";
import { SceneContext } from "../../contexts/SceneContext";
import { SettingsContext } from "../../contexts/SettingsContext";
import { Checkbox } from "../UI/Checkbox";
import RadioButton from "../UI/RadioButton";
import { useTranslation } from "react-i18next";
import { IEasyNameTag } from "../../types/IEasyNameTag";
import { SoftErrorContext } from "../../contexts/SoftErrorContext";

const symbols = {
    star: "☆",
    "star-filled": "★",
    squiggly: "～",
    "em-dash": "—",
    heart: "♡",
    "heart-filled": "❤︎",
    "quarter-note": "♩",
    "eighth-note": "♪",
    "beamed-eight-note": "♫",
    "beamed-sixteenth-note": "♬",
    "japanese-ellipsis": "…",
    "japanese-circle": "〇",
    "japanese-cross": "×",
};

const easyNameTagPlaceholders = [
    "Miku",
    "Rin",
    "Len",
    "Luka",
    "MEIKO",
    "KAITO",
];

const TextSidebar: React.FC = () => {
    const { t } = useTranslation();
    const scene = useContext(SceneContext);
    const settings = useContext(SettingsContext);
    const error = useContext(SoftErrorContext);

    const lockFontSize = localStorage.getItem("lockFontSize");
    const easySwitchEnabled = localStorage.getItem("easySwitchEnabled");

    const [bell, setBell] = useState<boolean>(false);
    const [easySwitch, setEasySwitch] = useState<boolean>(
        easySwitchEnabled === "true" ? true : false
    );
    const [nameTags, setNameTags] = useState<IEasyNameTag>({});
    const [nameTagInputs, setNameTagInputs] = useState<number>(2);
    const [lockFontSizeState, setLockFontSizeState] = useState<boolean>(
        lockFontSize === "true" ? true : false
    );

    useEffect(() => {
        const storedNameTags = localStorage.getItem("nameTags");
        if (storedNameTags) {
            setNameTags(JSON.parse(storedNameTags));
        }
        const storedNameTagInputs = localStorage.getItem("nameTagInputs");
        if (storedNameTagInputs) {
            setNameTagInputs(Number(storedNameTagInputs));
        }
    }, []);

    if (!scene || !settings || !error) {
        throw new Error("Context not found");
    }

    const { text, setText, sceneText, setSceneText, modelContainer } = scene;
    const { openTextOption, setOpenTextOption, openAll } = settings;
    const { setErrorInformation } = error;

    if (!text || !sceneText) return t("please-wait");

    const handleTab = (tab: string) => {
        setOpenTextOption(tab);
    };

    const handleNameTagChange = async (changedNameTag: string) => {
        text.nameTag.text = changedNameTag;
        text.nameTag.updateText(true);
        setText({
            ...text,
            nameTagString: changedNameTag,
        });
    };

    const handleDialogueBoxVisible = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const visible = Boolean(event?.target.checked);
        if (text?.textContainer) {
            text.textContainer.visible = visible;
        }
        setText({
            ...text,
            visible: visible,
        });
    };
    const handleSceneTextVisible = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const visible = Boolean(event?.target.checked);
        if (sceneText?.sceneTextContainer) {
            sceneText.sceneTextContainer.visible = visible;
        }
        if (!visible && text.hideEverything) {
            if (modelContainer) {
                modelContainer.visible = true;
            }
            text.textContainer.visible = true;
        }
        setSceneText({
            ...sceneText,
            visible: visible,
        });
        setText({
            ...text,
            hideEverything: false,
        });
    };

    const handleHideEverything = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!modelContainer) {
            return;
        }
        const hide = Boolean(event?.target.checked);

        modelContainer.visible = !hide;
        text.textContainer.visible = !hide;

        setText({
            ...text,
            hideEverything: hide,
        });
    };

    const handleDialogueChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const changedDialogue = event.target.value
            .replace(/“|”/g, '"')
            .replace(/‘|’/g, "'");
        text.dialogue.text = changedDialogue;
        text.dialogue.updateText(true);

        if (
            /bell/gim.test(changedDialogue) &&
            /mizuki/gim.test(text.nameTagString) &&
            !bell
        ) {
            window.open("https://ominous-bells.vercel.app/");
            alert("Let Mizuki rest.");
            setBell(true);
        }

        setText({
            ...text,
            dialogueString: changedDialogue,
        });
    };
    const handleSceneTextChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const changedSceneText = event.target.value
            .replace(/“|”/g, '"')
            .replace(/‘|’/g, "'");
        sceneText.text.text = changedSceneText;
        sceneText.text.updateText(true);

        setSceneText({
            ...sceneText,
            textString: changedSceneText,
        });
    };

    const handleAddSymbol = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const symbol = event.target.value;
        if (symbol !== "none") {
            text.dialogue.text += symbol;
            text.dialogue.updateText(true);
            setText({
                ...text,
                dialogueString: text.dialogue.text,
            });
        }
    };

    const handleFontSizeChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const changedFontSize = Number(event.target.value);
        text.dialogue.style.fontSize = changedFontSize;
        text.dialogue.style.strokeThickness = Math.floor(
            8 + (changedFontSize / 44 - 1) * 2
        );
        text.dialogue.style.lineHeight = Math.floor(
            55 + (changedFontSize / 44 - 1) * 40
        );
        text.dialogue.updateText(true);
        setText({
            ...text,
            fontSize: changedFontSize,
        });
    };

    const handleInputFontSizeChange = async () => {
        const inputChange = prompt("Enter a value");
        if (inputChange == null || isNaN(Number(inputChange))) return;
        const changedFontSize = Number(inputChange);
        text.dialogue.style.fontSize = changedFontSize;
        text.dialogue.style.strokeThickness =
            8 + (changedFontSize / 44 - 1) * 2;
        text.dialogue.updateText(true);
        setText({
            ...text,
            fontSize: changedFontSize,
        });
    };

    const handleEasyNameTagChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        nameTag: string
    ) => {
        const name = event.target.value;
        const radio = document.querySelector(
            `input[name="name-tag"][value="${nameTag}"]`
        ) as HTMLInputElement;
        const changeEasyNameTags = { ...nameTags, [nameTag]: name };
        setNameTags(changeEasyNameTags);
        if (radio.checked) {
            handleNameTagChange(name);
        }
        localStorage.setItem("nameTags", JSON.stringify(changeEasyNameTags));
    };

    const handleEasyNameTagSelect = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;
        let changedNameTag = "";
        changedNameTag = nameTags[value];
        text.nameTag.text = changedNameTag;
        text.nameTag.updateText(true);
        setText({
            ...text,
            nameTagString: changedNameTag,
        });
    };

    const handleYOffset = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        localStorage.setItem("textAlignment", String(value));
        text.nameTag.y = 780 + value;
        text.dialogue.y = 845 + value;
        setText({
            ...text,
            yOffset: value,
        });
    };

    const handleEasyNameTagInputs = (action: "add" | "remove") => {
        if (action === "add" && nameTagInputs < 6) {
            setNameTagInputs((prev) => prev + 1);
            localStorage.setItem("nameTagInputs", String(nameTagInputs + 1));
            return;
        }
        if (action === "remove" && nameTagInputs > 2) {
            setNameTagInputs((prev) => prev - 1);
            localStorage.setItem("nameTagInputs", String(nameTagInputs - 1));
            return;
        }

        setErrorInformation(t("error.name-tag-inputs-limit"));
    };

    return (
        <div>
            <h1>{t("text.header")}</h1>
            <div className="option" onClick={() => handleTab("name-tag")}>
                <div className="space-between flex-horizontal center">
                    <h2>{t("text.name-tag")}</h2>
                    {openAll || openTextOption === "name-tag" ? (
                        <i className="bi bi-caret-down-fill" />
                    ) : (
                        <i className="bi bi-caret-right-fill" />
                    )}
                </div>
                {(openAll || openTextOption === "name-tag") && (
                    <div className="option__content">
                        {!easySwitch ? (
                            <input
                                type="text"
                                name="name-tag"
                                id="name-tag"
                                value={text?.nameTagString}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    const changedNameTag = event.target.value;
                                    handleNameTagChange(changedNameTag);
                                }}
                            />
                        ) : (
                            <>
                                {Array.from({ length: nameTagInputs }).map(
                                    (_, index) => (
                                        <div
                                            key={index}
                                            className="flex-horizontal center"
                                        >
                                            <RadioButton
                                                name="name-tag"
                                                value={`nameTag${index + 1}`}
                                                onChange={
                                                    handleEasyNameTagSelect
                                                }
                                            />
                                            <input
                                                type="text"
                                                name="name-tag"
                                                value={
                                                    nameTags[
                                                        `nameTag${index + 1}`
                                                    ]
                                                }
                                                onChange={(e) => {
                                                    handleEasyNameTagChange(
                                                        e,
                                                        `nameTag${index + 1}`
                                                    );
                                                }}
                                                placeholder={
                                                    easyNameTagPlaceholders[
                                                        index
                                                    ] || ""
                                                }
                                            />
                                        </div>
                                    )
                                )}
                                <div className="layer-buttons">
                                    <button
                                        className="btn-circle btn-white"
                                        onClick={() =>
                                            handleEasyNameTagInputs("add")
                                        }
                                    >
                                        <i className="bi bi-plus-circle"></i>
                                    </button>
                                    <button
                                        className="btn-circle btn-white"
                                        onClick={() =>
                                            handleEasyNameTagInputs("remove")
                                        }
                                    >
                                        <i className="bi bi-x-circle"></i>
                                    </button>
                                </div>
                            </>
                        )}

                        <Checkbox
                            id="easy-switch"
                            label={t("text.easy-switch")}
                            checked={easySwitch}
                            onChange={() => {
                                setEasySwitch(!easySwitch);
                                localStorage.setItem(
                                    "easySwitchEnabled",
                                    String(!easySwitch)
                                );
                            }}
                        />
                    </div>
                )}
            </div>
            <div
                className="option"
                onClick={() => {
                    handleTab("dialogue");
                }}
            >
                <div className="space-between flex-horizontal center">
                    <h2>{t("text.dialogue")}</h2>
                    {openAll || openTextOption === "dialogue" ? (
                        <i className="bi bi-caret-down-fill" />
                    ) : (
                        <i className="bi bi-caret-right-fill" />
                    )}
                </div>
                {(openAll || openTextOption === "dialogue") && (
                    <div className="option__content">
                        <textarea
                            name="dialogue"
                            id="dialogue"
                            value={text?.dialogueString}
                            onChange={handleDialogueChange}
                        ></textarea>
                        <select
                            name="add-symbol"
                            id="add-symbol"
                            value="none"
                            onChange={handleAddSymbol}
                        >
                            <option value="none" disabled>
                                {t("text.add-symbol")}
                            </option>
                            {Object.entries(symbols).map(([key, value]) => (
                                <option key={key} value={value}>
                                    {`${value} (${key})`}
                                </option>
                            ))}
                        </select>
                        <div className="transform-icons">
                            <h3>
                                {t("text.font-size")} ({text.fontSize} px)
                            </h3>
                            <div>
                                <i
                                    className="bi bi-pencil-fill"
                                    onClick={handleInputFontSizeChange}
                                ></i>
                                <i
                                    className={
                                        lockFontSizeState
                                            ? "bi bi-unlock-fill"
                                            : "bi bi-lock-fill"
                                    }
                                    onClick={() => {
                                        setLockFontSizeState(
                                            !lockFontSizeState
                                        );
                                        localStorage.setItem(
                                            "lockFontSize",
                                            String(!lockFontSizeState)
                                        );
                                    }}
                                ></i>
                            </div>
                        </div>
                        <input
                            type="range"
                            name="font-size"
                            id="font-size"
                            value={text.fontSize}
                            min={10}
                            max={120}
                            onChange={handleFontSizeChange}
                            {...(lockFontSizeState ? { disabled: true } : {})}
                        />
                        <Checkbox
                            id="visible"
                            label={t("visible")}
                            checked={text.visible}
                            onChange={handleDialogueBoxVisible}
                        />
                    </div>
                )}
            </div>
            <div
                className="option"
                onClick={() => {
                    handleTab("scene-text");
                }}
            >
                <div className="space-between flex-horizontal center">
                    <h2>{t("text.scene-text")}</h2>
                    {openAll || openTextOption === "scene-text" ? (
                        <i className="bi bi-caret-down-fill" />
                    ) : (
                        <i className="bi bi-caret-right-fill" />
                    )}
                </div>
                {(openAll || openTextOption === "scene-text") && (
                    <div className="option__content">
                        <input
                            type="text"
                            name="name-tag"
                            id="name-tag"
                            value={sceneText.textString}
                            onChange={handleSceneTextChange}
                        />
                        <Checkbox
                            id="visible"
                            label={t("visible")}
                            checked={sceneText.visible}
                            onChange={handleSceneTextVisible}
                        />
                        {sceneText.visible && (
                            <Checkbox
                                id="hide-everything"
                                label={t("text.hide-everything")}
                                checked={text.hideEverything}
                                onChange={handleHideEverything}
                            />
                        )}
                    </div>
                )}
            </div>
            <div
                className="option"
                onClick={() => {
                    handleTab("y-offset");
                }}
            >
                <div className="space-between flex-horizontal center">
                    <h2>{t("text.y-offset")}</h2>
                    {openAll || openTextOption === "y-offset" ? (
                        <i className="bi bi-caret-down-fill" />
                    ) : (
                        <i className="bi bi-caret-right-fill" />
                    )}
                </div>
                {(openAll || openTextOption === "y-offset") && (
                    <div className="option__content">
                        <h3> Adjustment: ({text.yOffset}px)</h3>
                        <input
                            type="range"
                            name="offset"
                            id="offset"
                            min={-20}
                            max={20}
                            value={text.yOffset}
                            step={1}
                            onChange={handleYOffset}
                        />
                        <p>{t("text.y-offset-details")}</p>
                        <img
                            src="/img/y-offset.png"
                            alt="y-offset"
                            className="width-100 margin-top-10"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default TextSidebar;
