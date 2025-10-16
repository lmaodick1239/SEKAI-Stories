import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { SceneContext } from "../../../../contexts/SceneContext";

const YOffset: React.FC = () => {
    const { t } = useTranslation();

    const scene = useContext(SceneContext);
    if (!scene) throw new Error("Context not loaded");

    const { text, setText } = scene;

    if (!text) return <p>{t("please-wait")}</p>;

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
        <>
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
        </>
    );
};

export default YOffset;
