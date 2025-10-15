import React, { useContext } from "react";
import RadioButton from "../../../UI/RadioButton";
import { useTranslation } from "react-i18next";
import { SceneContext } from "../../../../contexts/SceneContext";
import { Checkbox } from "../../../UI/Checkbox";

const SceneText: React.FC = () => {
    const { t } = useTranslation();

    const scene = useContext(SceneContext);
    if (!scene) throw new Error("Context not loaded");

    const { text, setText, sceneText, setSceneText, modelWrapper } = scene;

    if (!text || !sceneText) return <p>{t("please-wait")}</p>;

    const handleSceneTextVisible = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const visible = Boolean(event?.target.checked);
        if (sceneText?.sceneTextContainer) {
            sceneText.sceneTextContainer.visible = visible;
        }
        if (!visible && text.hideEverything) {
            if (modelWrapper) {
                modelWrapper.visible = true;
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
        if (!modelWrapper) {
            return;
        }
        const hide = Boolean(event?.target.checked);

        modelWrapper.visible = !hide;
        text.textContainer.visible = !hide;

        setText({
            ...text,
            hideEverything: hide,
        });
    };

    const handleSceneTextChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const changedSceneText = event.target.value
            .replace(/“|”/g, '"')
            .replace(/‘|’/g, "'");

        sceneText.text.forEach((t) => {
            t.text = changedSceneText;
            t.updateText(true);
        });

        setSceneText({
            ...sceneText,
            textString: changedSceneText,
        });
    };

    const handleSceneTextVariantChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;

        switch (value) {
            case "top-left":
                sceneText.middle.visible = false;
                sceneText.topLeft.visible = true;
                break;
            case "middle":
                sceneText.middle.visible = true;
                sceneText.topLeft.visible = false;
                break;
        }

        setSceneText({
            ...sceneText,
            variant: value,
        });
    };

    return (
        <>
            <div className="option__content">
                <input
                    type="text"
                    name="scene-text"
                    id="scene-text"
                    value={sceneText.textString}
                    onChange={handleSceneTextChange}
                />
            </div>
            <div className="option__content">
                <h3>{t("text.scene-text-variant")}</h3>
                <div className="flex-horizontal center padding-top-bottom-10">
                    <RadioButton
                        name="scene-text-variant"
                        value="middle"
                        onChange={handleSceneTextVariantChange}
                        id="middle"
                        data={sceneText.variant}
                    />
                    <label className="width-100 radio__label" htmlFor="middle">
                        {t("text.scene-text-middle")}
                    </label>
                </div>
                <div className="flex-horizontal center padding-top-bottom-10">
                    <RadioButton
                        name="scene-text-variant"
                        value="top-left"
                        id="top-left"
                        onChange={handleSceneTextVariantChange}
                        data={sceneText.variant}
                    />
                    <label
                        className="width-100 radio__label"
                        htmlFor="top-left"
                    >
                        {t("text.scene-text-top-left")}
                    </label>
                </div>
            </div>
            <div className="option__content">
                <h3>{t("text.toggles")}</h3>
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
        </>
    );
};

export default SceneText;
