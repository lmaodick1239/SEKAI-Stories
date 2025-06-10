import React, { useContext, useState } from "react";
import { SceneContext } from "../../contexts/SceneContext";
import { SidebarContext } from "../../contexts/SidebarContext";
import { Checkbox } from "../UI/Checkbox";
import RadioButton from "../UI/RadioButton";
import { useTranslation } from "react-i18next";

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

const TextSidebar: React.FC = () => {
    const { t } = useTranslation();
    const scene = useContext(SceneContext);
    const sidebar = useContext(SidebarContext);

    const nameTag1Cookie = localStorage.getItem("nameTag1");
    const nameTag2Cookie = localStorage.getItem("nameTag2");
    const lockFontSize = localStorage.getItem("lockFontSize");
    const easySwitchEnabled = localStorage.getItem("easySwitchEnabled");

    const [bell, setBell] = useState<boolean>(false);
    const [easySwitch, setEasySwitch] = useState<boolean>(
        easySwitchEnabled === "true" ? true : false
    );
    const [nameTags, setNameTags] = useState<Record<string, string>>({
        nameTag1: nameTag1Cookie ? nameTag1Cookie : "",
        nameTag2: nameTag2Cookie ? nameTag2Cookie : "",
    });
    const [lockFontSizeState, setLockFontSizeState] = useState<boolean>(
        lockFontSize === "true" ? true : false
    );

    if (!scene || !sidebar || !scene.text || !scene.sceneText) {
        return t("please-wait");
    }

    const {
        text,
        setText,
        sceneText,
        setSceneText
    } = scene;
    const { openTextOption, setOpenTextOption, openAll } = sidebar;

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
        setSceneText({
            ...sceneText,
            visible: visible,
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
        setNameTags({
            ...nameTags,
            [nameTag]: name,
        });
        if (radio.checked) {
            handleNameTagChange(name);
        }
        localStorage.setItem(nameTag, name);
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
                                <div className="flex-horizontal center">
                                    <RadioButton
                                        name="name-tag"
                                        value="nameTag1"
                                        onChange={handleEasyNameTagSelect}
                                    />

                                    <input
                                        type="text"
                                        name="name-tag"
                                        value={nameTags["nameTag1"]}
                                        onChange={(e) => {
                                            handleEasyNameTagChange(
                                                e,
                                                "nameTag1"
                                            );
                                        }}
                                        placeholder="Miku"
                                    />
                                </div>
                                <div className="flex-horizontal center">
                                    <RadioButton
                                        name="name-tag"
                                        value="nameTag2"
                                        onChange={handleEasyNameTagSelect}
                                    />
                                    <input
                                        type="text"
                                        name="name-tag"
                                        value={nameTags["nameTag2"]}
                                        onChange={(e) => {
                                            handleEasyNameTagChange(
                                                e,
                                                "nameTag2"
                                            );
                                        }}
                                        placeholder="Teto"
                                    />
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
