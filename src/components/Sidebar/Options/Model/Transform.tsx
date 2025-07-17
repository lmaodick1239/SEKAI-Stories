import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { SceneContext } from "../../../../contexts/SceneContext";
import IModel from "../../../../types/IModel";
import { Checkbox } from "../../../UI/Checkbox";

const SNAP = 50;
interface TransformProps {
    updateModelState: (updates: Partial<IModel>) => void;
}

const Transform: React.FC<TransformProps> = ({ updateModelState }) => {
    const { t } = useTranslation();
    const scene = useContext(SceneContext);

    if (!scene) {
        throw new Error("Context not found");
    }
    const { currentModel, modelContainer, layers } = scene;

    if (!currentModel) return;
    const handleMoveLayer = async (type: string) => {
        if (!modelContainer || !currentModel) return;

        const layerIndex = modelContainer.getChildIndex(currentModel.model);
        switch (type) {
            case "forward":
                if (layerIndex + 1 >= layers) return;
                modelContainer.setChildIndex(
                    currentModel.model,
                    layerIndex + 1
                );
                break;
            case "backward":
                if (layerIndex - 1 < 0) return;
                modelContainer.setChildIndex(
                    currentModel.model,
                    layerIndex - 1
                );
                break;
        }
    };
    const handleXTransform = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        let x = Number(event?.target.value);
        if (x > 640 - SNAP && x < 640 + SNAP) {
            x = 640;
        } else if (x > 960 - SNAP && x < 960 + SNAP) {
            x = 960;
        } else if (x > 1280 - SNAP && x < 1280 + SNAP) {
            x = 1280;
        }
        currentModel?.model.position.set(x, currentModel.modelY);

        updateModelState({ modelX: x });
    };

    const handleYTransform = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        let y = Number(event?.target.value);
        if (y > 540 - SNAP && y < 540 + SNAP) {
            y = 540;
        } else if (y > 865 - SNAP && y < 865 + SNAP) {
            y = 865;
        }

        currentModel?.model.position.set(currentModel.modelX, y);
        updateModelState({ modelY: y });
    };

    const handleScaleTransform = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const scale = Number(event?.target.value);
        currentModel?.model.scale.set(scale, scale);
        updateModelState({ modelScale: scale });
    };

    const handleRotationTransform = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const rotation = Number(event?.target.value);
        if (currentModel?.model) {
            currentModel.model.angle = rotation;
        }
        updateModelState({ modelRotation: rotation });
    };

    const handleVisible = (event: React.ChangeEvent<HTMLInputElement>) => {
        const visible = Boolean(event?.target.checked);
        if (currentModel?.model) {
            currentModel.model.visible = visible;
        }
        updateModelState({ visible: visible });
    };

    const handleTransformChange = async (type: string) => {
        const inputChange = prompt("Enter a value");
        if (inputChange == null || isNaN(Number(inputChange))) return;
        if (!currentModel?.model) return;
        const toChange = Number(inputChange);

        switch (type) {
            case "x": {
                currentModel?.model.position.set(toChange, currentModel.modelY);
                updateModelState({ modelX: toChange });
                break;
            }
            case "y": {
                currentModel?.model.position.set(currentModel.modelX, toChange);
                updateModelState({ modelY: toChange });
                break;
            }
            case "scale": {
                currentModel?.model.scale.set(toChange, toChange);
                updateModelState({ modelScale: toChange });
                break;
            }
            case "rotation": {
                currentModel.model.angle = toChange;
                updateModelState({ modelRotation: toChange });
                break;
            }
        }
    };

    return (
        <>
            <div className="option__content">
                <div className="transform-icons">
                    <h3>
                        {t("model.x-position")} ({currentModel?.modelX}px)
                    </h3>
                    <div>
                        <i
                            className="bi bi-pencil-fill"
                            onClick={() => handleTransformChange("x")}
                        ></i>
                    </div>
                </div>
                <input
                    type="range"
                    name="x-value"
                    id="x-value"
                    min={0}
                    max={1920}
                    value={currentModel?.modelX}
                    onChange={handleXTransform}
                />
            </div>
            <div className="option__content">
                <div className="transform-icons">
                    <h3>
                        {t("model.y-position")} ({currentModel?.modelY}px)
                    </h3>
                    <div>
                        <i
                            className="bi bi-pencil-fill"
                            onClick={() => handleTransformChange("y")}
                        ></i>
                    </div>
                </div>
                <input
                    type="range"
                    name="y-value"
                    id="y-value"
                    min={0}
                    max={1080}
                    value={currentModel?.modelY}
                    onChange={handleYTransform}
                />
            </div>
            <div className="option__content">
                <div className="transform-icons">
                    <h3>
                        {t("model.scale")} ({currentModel?.modelScale})
                    </h3>
                    <div>
                        <i
                            className="bi bi-pencil-fill"
                            onClick={() => handleTransformChange("scale")}
                        ></i>
                    </div>
                </div>
                <input
                    type="range"
                    name="scale"
                    id="scale"
                    min={0}
                    max={1}
                    step={0.01}
                    value={currentModel?.modelScale}
                    onChange={handleScaleTransform}
                />
            </div>
            <div className="option__content">
                <div className="transform-icons">
                    <h3>
                        {t("model.rotation")} ({currentModel?.modelRotation})
                    </h3>
                    <div>
                        <i
                            className="bi bi-pencil-fill"
                            onClick={() => handleTransformChange("rotation")}
                        ></i>
                    </div>
                </div>
                <input
                    type="range"
                    name="rotation"
                    id="rotation"
                    min={0}
                    max={360}
                    step={1}
                    value={currentModel?.modelRotation}
                    onChange={handleRotationTransform}
                />
            </div>
            <div className="option__content">
                <h3>{t("model.toggles")}</h3>
                <Checkbox
                    id="visible"
                    label={t("visible")}
                    checked={currentModel?.visible}
                    onChange={handleVisible}
                />
            </div>
            <div className="option__conten">
                <h3>{t("model.layering")}</h3>
                <div className="layer-buttons">
                    <button
                        className="btn-circle btn-white"
                        onClick={() => {
                            handleMoveLayer("forward");
                        }}
                    >
                        <i className="bi bi-front"></i>
                    </button>
                    <button
                        className="btn-circle btn-white"
                        onClick={() => {
                            handleMoveLayer("backward");
                        }}
                    >
                        <i className="bi bi-back"></i>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Transform;
