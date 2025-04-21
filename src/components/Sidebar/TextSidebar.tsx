import React, { useContext, useState } from "react";
import { AppContext } from "../../contexts/AppContext";
import { Checkbox } from "../Checkbox";

const TextSidebar: React.FC = () => {
    const context = useContext(AppContext);
    const [bell, setBell] = useState<boolean>(false);

    if (!context || !context.text) {
        return "Please wait...";
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

    return (
        <div>
            <h1>Text</h1>
            <div className="option">
                <h2>Name Tag</h2>
                <div className="option__content">
                    <input
                        type="text"
                        name="name-tag"
                        id="name-tag"
                        value={text?.nameTagString}
                        onChange={handleNameTagChange}
                    />
                </div>
            </div>
            <div className="option">
                <h2>Dialogue</h2>
                <div className="option__content">
                    <textarea
                        name="dialogue"
                        id="dialogue"
                        value={text?.dialogueString}
                        onChange={handleDialogueChange}
                    ></textarea>
                    <h3>Font Size ({text.fontSize} px)</h3>
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
                        label="Visible"
                        checked={text.visible}
                        onChange={handleVisible}
                    />
                </div>
            </div>
        </div>
    );
};

export default TextSidebar;
