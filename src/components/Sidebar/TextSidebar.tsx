import React, { useContext, useState } from "react";
import { AppContext } from "../../contexts/AppContext";
import { Checkbox } from "../Checkbox";
import RadioButton from "../RadioButton";
import { useTranslation } from "react-i18next";

const TextSidebar: React.FC = () => {
    const { t } = useTranslation();

    const context = useContext(AppContext);
    const [bell, setBell] = useState<boolean>(false);
    const [easySwitch, setEasySwitch] = useState<boolean>(false);
    const [nameTags, setNameTags] = useState<Record<string, string>>({
        nameTag1: "",
        nameTag2: "",
    });

    if (!context || !context.text) {
        return t("please-wait");
    }

    const { text, setText } = context;

    const handleNameTagChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const changedNameTag = event.target.value;
        text.nameTag.text = changedNameTag;
        text.nameTag.updateText(true);
        setText({
            ...text,
            nameTagString: changedNameTag,
        });
    };

    const handleVisible = (event: React.ChangeEvent<HTMLInputElement>) => {
        const visible = Boolean(event?.target.checked);
        if (text?.textContainer) {
            text.textContainer.visible = visible;
        }
        setText({
            ...text,
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

    const handleEasyNameTagChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        nameTag: string
    ) => {
        const name = event.target.value;
        if (nameTag == "nameTag1") {
            setNameTags({
                ...nameTags,
                nameTag1: name,
            });
        }
        if (nameTag == "nameTag2") {
            setNameTags({
                ...nameTags,
                nameTag2: name,
            });
        }
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
            <h1>{t("text-header")}</h1>
            <div className="option">
                <h2>{t("name-tag")}</h2>
                <div className="option__content">
                    {!easySwitch ? (
                        <input
                            type="text"
                            name="name-tag"
                            id="name-tag"
                            value={text?.nameTagString}
                            onChange={handleNameTagChange}
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
                                />
                            </div>
                        </>
                    )}

                    <Checkbox
                        id="easy-switch"
                        label={t("easy-switch")}
                        checked={easySwitch}
                        onChange={() => {
                            setEasySwitch(!easySwitch);
                        }}
                    />
                </div>
            </div>
            <div className="option">
                <h2>{t("dialogue")}</h2>
                <div className="option__content">
                    <textarea
                        name="dialogue"
                        id="dialogue"
                        value={text?.dialogueString}
                        onChange={handleDialogueChange}
                    ></textarea>
                    <h3>{t("font-size")} ({text.fontSize} px)</h3>
                    <input
                        type="range"
                        name="font-size"
                        id="font-size"
                        value={text.fontSize}
                        min={10}
                        max={120}
                        onChange={handleFontSizeChange}
                    />
                    <Checkbox
                        id="visible"
                        label={t("visible")}
                        checked={text.visible}
                        onChange={handleVisible}
                    />
                </div>
            </div>
        </div>
    );
};

export default TextSidebar;
