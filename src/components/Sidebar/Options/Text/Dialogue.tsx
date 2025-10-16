import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import { SceneContext } from "../../../../contexts/SceneContext";
import { useTranslation } from "react-i18next";
import { Checkbox } from "../../../UI/Checkbox";
import InputWindow from "../../../UI/InputWindow";
import { SoftErrorContext } from "../../../../contexts/SoftErrorContext";

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

interface DialogueProps {
    bell: boolean;
    setBell: Dispatch<SetStateAction<boolean>>;
    lockFontSizeState: boolean;
    setLockFontSizeState: Dispatch<SetStateAction<boolean>>;
}

const Dialogue: React.FC<DialogueProps> = ({
    bell,
    setBell,
    lockFontSizeState,
    setLockFontSizeState,
}) => {
    const { t } = useTranslation();

    const scene = useContext(SceneContext);
    const error = useContext(SoftErrorContext);
    if (!scene || !error) throw new Error("Context not loaded");
    const { text, setText } = scene;
    const { setErrorInformation } = error;
    const [showFontSizeInput, setShowFontSizeInput] = useState<boolean>(false);

    if (!text) return <p>{t("please-wait")}</p>;

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
            setErrorInformation("Let Mizuki rest. She's happy now.");
            setBell(true);
        }

        setText({
            ...text,
            dialogueString: changedDialogue,
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

    const handleInputFontSizeChange = async (inputChange: string) => {
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

    return (
        <>
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
                        onClick={() => setShowFontSizeInput(true)}
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
            {showFontSizeInput && (
                <InputWindow
                    show={setShowFontSizeInput}
                    confirmFunction={(x: string) =>
                        handleInputFontSizeChange(x)
                    }
                    description={t("text.enter-font-size")}
                />
            )}
        </>
    );
};

export default Dialogue;
