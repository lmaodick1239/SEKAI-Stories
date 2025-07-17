import React, { Dispatch, SetStateAction, useContext } from "react";
import { SceneContext } from "../../../../contexts/SceneContext";
import { SettingsContext } from "../../../../contexts/SettingsContext";
import { useTranslation } from "react-i18next";
import RadioButton from "../../../UI/RadioButton";
import { SoftErrorContext } from "../../../../contexts/SoftErrorContext";
import { Checkbox } from "../../../UI/Checkbox";

interface NameTagsProps {
    easyNameTagSelected: string;
    setEasyNameTagSelected: Dispatch<SetStateAction<string>>;
}

const easyNameTagPlaceholders = [
    "Miku",
    "Rin",
    "Len",
    "Luka",
    "MEIKO",
    "KAITO",
];

const NameTags: React.FC<NameTagsProps> = ({
    easyNameTagSelected,
    setEasyNameTagSelected,
}) => {
    const { t } = useTranslation();

    const scene = useContext(SceneContext);
    const settings = useContext(SettingsContext);
    const error = useContext(SoftErrorContext);

    if (!scene || !settings || !error) throw new Error("Context not loaded");
    const { text, setText } = scene;
    const {
        easySwitch,
        setEasySwitch,
        nameTags,
        setNameTags,
        nameTagInputs,
        setNameTagInputs,
    } = settings;
    const { setErrorInformation } = error;

    if (!text) return t("please-wait");

    const handleNameTagChange = async (changedNameTag: string) => {
        text.nameTag.text = changedNameTag;
        text.nameTag.updateText(true);
        setText({
            ...text,
            nameTagString: changedNameTag,
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
        setEasyNameTagSelected(value);
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
        <>
            {!easySwitch ? (
                <input
                    type="text"
                    name="name-tag"
                    id="name-tag"
                    value={text?.nameTagString}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const changedNameTag = event.target.value;
                        handleNameTagChange(changedNameTag);
                    }}
                />
            ) : (
                <>
                    {Array.from({ length: nameTagInputs }).map((_, index) => (
                        <div key={index} className="flex-horizontal center">
                            <RadioButton
                                name="name-tag"
                                value={`nameTag${index + 1}`}
                                onChange={handleEasyNameTagSelect}
                                data={easyNameTagSelected}
                            />
                            <input
                                type="text"
                                name="name-tag"
                                value={nameTags[`nameTag${index + 1}`]}
                                onChange={(e) => {
                                    handleEasyNameTagChange(
                                        e,
                                        `nameTag${index + 1}`
                                    );
                                }}
                                placeholder={
                                    easyNameTagPlaceholders[index] || ""
                                }
                            />
                        </div>
                    ))}
                    <div className="layer-buttons">
                        <button
                            className="btn-circle btn-white"
                            onClick={() => handleEasyNameTagInputs("add")}
                        >
                            <i className="bi bi-plus-circle"></i>
                        </button>
                        <button
                            className="btn-circle btn-white"
                            onClick={() => handleEasyNameTagInputs("remove")}
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
        </>
    );
};

export default NameTags;
