import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { SceneContext } from "../../../../contexts/SceneContext";
import { AdjustmentFilter } from "pixi-filters";
import { ILighting, LightingKey } from "../../../../types/ILighting";

const defaultPresets: Record<string, ILighting> = {
    default: {
        red: 1,
        green: 1,
        blue: 1,
        brightness: 1,
        saturation: 1,
    },
    warm: {
        red: 1,
        green: 1,
        blue: 0.85,
        brightness: 1,
        saturation: 1,
    },
    night: {
        red: 0.9,
        green: 0.9,
        blue: 1,
        brightness: 1,
        saturation: 1,
    },
    off: {
        red: 1,
        green: 1,
        blue: 1,
        brightness: 0.25,
        saturation: 1,
    },
    bright: {
        red: 1,
        green: 1,
        blue: 1,
        brightness: 1.15,
        saturation: 1,
    },
    silhoutte: {
        red: 1,
        green: 1,
        blue: 1,
        brightness: 0,
        saturation: 1,
    },
};

const Lighting: React.FC = () => {
    const { t } = useTranslation();
    const scene = useContext(SceneContext);
    if (!scene) throw new Error("Context not found");
    const { lighting, setLighting, modelWrapper } = scene;

    const handlePreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!lighting || !modelWrapper?.filters) return;

        const value = e.target.value;
        const preset = defaultPresets[value];
        if (!preset) return;
        const lightingFilter = modelWrapper?.filters[0] as AdjustmentFilter;
        (Object.keys(preset) as (keyof ILighting)[]).forEach((key) => {
            lightingFilter[key] = preset[key];  
        });
        setLighting({ ...preset });
    };

    const handleLighting = (key: LightingKey, value: number) => {
        if (!lighting || !modelWrapper?.filters) return;
        const lightingFilter = modelWrapper?.filters[0] as AdjustmentFilter;
        lightingFilter[key] = value;
        setLighting({
            ...lighting,
            [key]: value,
        });
    };

    if (!lighting || !modelWrapper) return;
    return (
        <>
            <div className="option__content">
                <select onChange={handlePreset} value="preset">
                    <option value="preset" disabled>
                        {t("background.select-preset")}
                    </option>
                    {
                        Object.keys(defaultPresets).map((preset) =>
                            <option value={preset} key={preset}>
                                {t(`background.${preset}`)}
                            </option>
                        )
                    }
                    
                </select>
            </div>
            <div className="option__content">
                <h3>
                    {t("background.red")} ({lighting.red})
                </h3>
                <input
                    type="range"
                    name="lighting-red"
                    id="lighting-red"
                    min={0}
                    max={2}
                    step={0.01}
                    value={lighting.red}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        handleLighting("red", value);
                    }}
                />
            </div>
            <div className="option__content">
                <h3>
                    {t("background.green")} ({lighting.green})
                </h3>
                <input
                    type="range"
                    name="lighting-green"
                    id="lighting-green"
                    min={0}
                    max={2}
                    step={0.01}
                    value={lighting.green}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        handleLighting("green", value);
                    }}
                />
            </div>
            <div className="option__content">
                <h3>
                    {t("background.blue")} ({lighting.blue})
                </h3>
                <input
                    type="range"
                    name="lighting-blue"
                    id="lighting-blue"
                    min={0}
                    max={2}
                    step={0.01}
                    value={lighting.blue}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        handleLighting("blue", value);
                    }}
                />
            </div>
            <div className="option__content">
                <h3>
                    {t("background.brightness")} ({lighting.brightness})
                </h3>
                <input
                    type="range"
                    name="lighting-brightness"
                    id="lighting-brightness"
                    min={0}
                    max={2}
                    step={0.01}
                    value={lighting.brightness}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        handleLighting("brightness", value);
                    }}
                />
            </div>
            <div className="option__content">
                <h3>
                    {t("background.saturation")} ({lighting.saturation})
                </h3>
                <input
                    type="range"
                    name="lighting-saturation"
                    id="lighting-saturation"
                    min={0}
                    max={2}
                    step={0.01}
                    value={lighting.saturation}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        handleLighting("saturation", value);
                    }}
                />
            </div>
        </>
    );
};

export default Lighting;
