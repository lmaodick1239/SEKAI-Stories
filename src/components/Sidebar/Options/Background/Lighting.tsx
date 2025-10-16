import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { SceneContext } from "../../../../contexts/SceneContext";
import { AdjustmentFilter } from "pixi-filters";
import { ILighting, LightingKey } from "../../../../types/ILighting";
import InputWindow from "../../../UI/InputWindow";

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
    const [custom, setCustom] = useState<string | null>(null);
    const [showLightingInput, setShowLightingInput] = useState<boolean>(false);
    const [lightingType, setLightingType] = useState<LightingKey | null>(null);
    if (!scene) throw new Error("Context not found");
    const { lighting, setLighting, modelWrapper } = scene;

    const handlePreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!lighting || !modelWrapper?.filters) return;

        const value = e.target.value;
        let preset;
        if (value.startsWith("preset-")) {
            setCustom(value);
            const savedCustomPreset = localStorage.getItem(value);
            preset = savedCustomPreset
                ? JSON.parse(savedCustomPreset)
                : { red: 1, green: 1, blue: 1, brightness: 1, saturation: 1 };
        } else {
            setCustom(null);
            preset = defaultPresets[value];
        }

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
        const newLighting = {
            ...lighting,
            [key]: value,
        };
        setLighting(newLighting);
        if (custom) {
            localStorage.setItem(custom, JSON.stringify(newLighting));
        }
    };
    const handleLightingChange = async (inputChange: string) => {
        if (inputChange == null || isNaN(Number(inputChange))) return;
        if (!lighting || !modelWrapper?.filters || !lightingType) return;

        const toChange = Number(inputChange);
        const lightingFilter = modelWrapper?.filters[0] as AdjustmentFilter;
        lightingFilter[lightingType] = toChange;

        const newLighting = {
            ...lighting,
            [lightingType]: toChange,
        };
        setLighting(newLighting);
        if (custom) {
            localStorage.setItem(custom, JSON.stringify(newLighting));
        }
    };

    if (!lighting || !modelWrapper) return;
    return (
        <>
            <div className="option__content">
                <select onChange={handlePreset} value="preset">
                    <option value="preset" disabled>
                        {t("background.select-preset")}
                    </option>
                    {Object.keys(defaultPresets).map((preset) => (
                        <option value={preset} key={preset}>
                            {t(`background.${preset}`)}
                        </option>
                    ))}
                    <option value="preset-1">
                        {t("background.custom-preset")} 1
                    </option>
                    <option value="preset-2">
                        {t("background.custom-preset")} 2
                    </option>
                    <option value="preset-3">
                        {t("background.custom-preset")} 3
                    </option>
                </select>
            </div>
            <div className="option__content">
                <div className="transform-icons">
                    <h3>
                        {t("background.red")} ({lighting.red})
                    </h3>
                    <div>
                        <i
                            className="bi bi-pencil-fill"
                            onClick={() => {
                                setLightingType("red");
                                setShowLightingInput(true);
                            }}
                        ></i>
                    </div>
                </div>

                <input
                    type="range"
                    name="lighting-red"
                    id="lighting-red"
                    min={0}
                    max={2}
                    step={0.05}
                    value={lighting.red}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        handleLighting("red", value);
                    }}
                />
            </div>
            <div className="option__content">
                <div className="transform-icons">
                    <h3>
                        {t("background.green")} ({lighting.green})
                    </h3>
                    <div>
                        <i
                            className="bi bi-pencil-fill"
                            onClick={() => {
                                setLightingType("green");
                                setShowLightingInput(true);
                            }}
                        ></i>
                    </div>
                </div>
                <input
                    type="range"
                    name="lighting-green"
                    id="lighting-green"
                    min={0}
                    max={2}
                    step={0.05}
                    value={lighting.green}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        handleLighting("green", value);
                    }}
                />
            </div>
            <div className="option__content">
                <div className="transform-icons">
                    <h3>
                        {t("background.blue")} ({lighting.blue})
                    </h3>
                    <div>
                        <i
                            className="bi bi-pencil-fill"
                            onClick={() => {
                                setLightingType("blue");
                                setShowLightingInput(true);
                            }}
                        ></i>
                    </div>
                </div>
                <input
                    type="range"
                    name="lighting-blue"
                    id="lighting-blue"
                    min={0}
                    max={2}
                    step={0.05}
                    value={lighting.blue}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        handleLighting("blue", value);
                    }}
                />
            </div>
            <div className="option__content">
                <div className="transform-icons">
                    <h3>
                        {t("background.brightness")} ({lighting.brightness})
                    </h3>
                    <div>
                        <i
                            className="bi bi-pencil-fill"
                            onClick={() => {
                                setLightingType("brightness");
                                setShowLightingInput(true);
                            }}
                        ></i>
                    </div>
                </div>
                <input
                    type="range"
                    name="lighting-brightness"
                    id="lighting-brightness"
                    min={0}
                    max={2}
                    step={0.05}
                    value={lighting.brightness}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        handleLighting("brightness", value);
                    }}
                />
            </div>
            <div className="option__content">
                <div className="transform-icons">
                    <h3>
                        {t("background.saturation")} ({lighting.saturation})
                    </h3>
                    <div>
                        <i
                            className="bi bi-pencil-fill"
                            onClick={() => {
                                setLightingType("saturation");
                                setShowLightingInput(true);
                            }}
                        ></i>
                    </div>
                </div>
                <input
                    type="range"
                    name="lighting-saturation"
                    id="lighting-saturation"
                    min={0}
                    max={2}
                    step={0.05}
                    value={lighting.saturation}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        handleLighting("saturation", value);
                    }}
                />
            </div>
            {custom && (
                <div className="option__content">
                    <p>Currently editing {custom}</p>
                </div>
            )}
            {showLightingInput && (
                <InputWindow
                    show={setShowLightingInput}
                    confirmFunction={(x: string) => handleLightingChange(x)}
                />
            )}
        </>
    );
};

export default Lighting;
