import React, { useContext, useState } from "react";
import { SceneContext } from "../../contexts/SceneContext";
import { Checkbox } from "../Checkbox";
import RadioButton from "../RadioButton";
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
};

const TextSidebar: React.FC = () => {
    const { t } = useTranslation();

    const nameTag1Cookie = localStorage.getItem("nameTag1");
    const nameTag2Cookie = localStorage.getItem("nameTag2");
    const lockFontSize = localStorage.getItem("lockFontSize");
    const easySwitchEnabled = localStorage.getItem("easySwitchEnabled");

    const context = useContext(SceneContext);
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

    if (!context || !context.text || !context.sceneSetting) {
        return t("please-wait");
    }

    const { text, setText, sceneSetting, setSceneSetting } = context;

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
    const handleSceneSettingVisible = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const visible = Boolean(event?.target.checked);
        if (sceneSetting?.sceneSettingContainer) {
            sceneSetting.sceneSettingContainer.visible = visible;
        }
        setSceneSetting({
            ...sceneSetting,
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
    const handleSceneSettingChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const changedSceneSetting = event.target.value
            .replace(/“|”/g, '"')
            .replace(/‘|’/g, "'");
        sceneSetting.text.text = changedSceneSetting;
        sceneSetting.text.updateText(true);

        setSceneSetting({
            ...sceneSetting,
            textString: changedSceneSetting,
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
        text.dialogue.style.strokeThickness =
            8 + (changedFontSize / 44 - 1) * 2;
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

    return (
        <div>
            <h1>{t("text.header")}</h1>
            <div className="option">
                <h2>{t("text.name-tag")}</h2>
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
                                        handleEasyNameTagChange(e, "nameTag1");
                                    }}
                                    placeholder="Student A"
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
                                        handleEasyNameTagChange(e, "nameTag2");
                                    }}
                                    placeholder="Student B"
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
            </div>
            <div className="option">
                <h2>{t("text.dialogue")}</h2>
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
                                    setLockFontSizeState(!lockFontSizeState);
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
                <div className="option">
                    <h2>{t("text.scene-text")}</h2>
                    <div className="option__content">
                        <input
                            type="text"
                            name="name-tag"
                            id="name-tag"
                            value={sceneSetting.textString}
                            onChange={handleSceneSettingChange}
                        />
                        <Checkbox
                            id="visible"
                            label={t("visible")}
                            checked={sceneSetting.visible}
                            onChange={handleSceneSettingVisible}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextSidebar;
