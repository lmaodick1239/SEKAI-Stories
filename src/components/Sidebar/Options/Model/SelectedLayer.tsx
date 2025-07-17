import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import * as PIXI from "pixi.js";
import { SceneContext } from "../../../../contexts/SceneContext";
import { SoftErrorContext } from "../../../../contexts/SoftErrorContext";
import { useTranslation } from "react-i18next";
import AddModelSelect from "../../../AddModelSelect";
import UploadImageButton from "../../../UI/UploadButton";
import { Cubism4InternalModel } from "pixi-live2d-display";

interface SelectedLayerProps {
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    setCurrentSelectedCharacter: Dispatch<SetStateAction<string>>;
    setLayerIndex: Dispatch<SetStateAction<number>>;
    setSelectedParameter: Dispatch<
        SetStateAction<{ idx: number; param: string }>
    >;
    setCoreModel: Dispatch<
        SetStateAction<Cubism4InternalModel["coreModel"] | null>
    >;
    handleLive2DChange?: (callback: () => void) => void;
}

const SelectedLayer: React.FC<SelectedLayerProps> = ({
    isLoading,
    setIsLoading,
    setCurrentSelectedCharacter,
    setLayerIndex,
    setSelectedParameter,
    setCoreModel,
    handleLive2DChange = (callback) => callback(),
}) => {
    const { t } = useTranslation();
    const scene = useContext(SceneContext);
    const softError = useContext(SoftErrorContext);
    const [showAddModelScreen, setShowAddModelScreen] =
        useState<boolean>(false);

    if (!scene || !softError) {
        throw new Error("Context not found");
    }
    const {
        models,
        setModels,
        modelContainer,
        nextLayer,
        setNextLayer,
        layers,
        setLayers,
        currentKey,
        setCurrentKey,
        currentModel,
        setCurrentModel,
        setInitialState,
    } = scene;

    const { setErrorInformation } = softError;

    if (!models) return t("please-wait");

    const handleLayerChange = async (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const key = event?.target.value;
        const selectedIndex = event.target.selectedIndex;
        setCurrentKey(key);
        setCurrentModel(models[key]);
        setCurrentSelectedCharacter(models[key].character);
        setLayerIndex(selectedIndex);

        setSelectedParameter({ idx: -1, param: "_" });
    };

    const handleAddLayer = async (from: string) => {
        const modelName = "none";
        const texture = await PIXI.Texture.fromURL(
            "/img/Background_New_Layer.png"
        );
        const sprite = new PIXI.Sprite(texture);
        modelContainer?.addChildAt(sprite, layers);
        const newLayer = {
            [`character${nextLayer + 1}`]: {
                character: "none",
                modelName: modelName,
                model: sprite,
                modelX: 640,
                modelY: 870,
                modelRotation: 0,
                modelScale: 0.5,
                virtualEffect: false,
                expression: 99999,
                pose: 99999,
                idle: true,
                visible: true,
                modelData: undefined,
                from: from,
                parametersChanged: {},
            },
        };
        setModels((prevModels) => ({
            ...prevModels,
            ...newLayer,
        }));
        setCurrentKey(`character${nextLayer + 1}`);
        setCurrentModel(newLayer[`character${nextLayer + 1}`]);
        setCurrentSelectedCharacter("none");
        setLayerIndex(layers);
        setNextLayer(nextLayer + 1);
        setLayers(layers + 1);
        setInitialState(false);
    };

    const handleUploadImage = async (file: File) => {
        const imgSrc = URL.createObjectURL(file);
        const modelName = imgSrc;
        const texture = await PIXI.Texture.fromURL(modelName);
        const sprite = new PIXI.Sprite(texture);
        sprite.anchor.set(0.5, 0.5);
        sprite.position.set(960, 540);
        modelContainer?.addChildAt(sprite, layers);
        const newLayer = {
            [`character${nextLayer + 1}`]: {
                character: "custom",
                modelName: modelName,
                model: sprite,
                modelX: 960,
                modelY: 540,
                modelRotation: 0,
                modelScale: sprite.scale.x,
                virtualEffect: false,
                expression: 99999,
                pose: 99999,
                idle: true,
                visible: true,
                modelData: undefined,
                from: "upload",
                parametersChanged: {},
            },
        };
        setModels((prevModels) => ({
            ...prevModels,
            ...newLayer,
        }));
        setCurrentKey(`character${nextLayer + 1}`);
        setCurrentModel(newLayer[`character${nextLayer + 1}`]);
        setCurrentSelectedCharacter("custom");
        setLayerIndex(layers);
        setNextLayer(nextLayer + 1);
        setLayers(layers + 1);
    };

    const handleDeleteLayer = async () => {
        const modelsObjects = Object.entries(scene.models ?? {});
        if (modelsObjects.length == 1) {
            setErrorInformation(t("model.delete-model-warn"));
            return;
        }
        setIsLoading(true);
        setCoreModel(null);
        currentModel?.model.destroy();
        delete models[currentKey];
        const firstKey = Object.keys(models)[0];
        setCurrentKey(firstKey);
        setCurrentModel(models[firstKey]);
        setCurrentSelectedCharacter(models[firstKey].character);
        setLayerIndex(0);
        setLayers(layers - 1);
        setIsLoading(false);
        setSelectedParameter({ idx: -1, param: "_" });
    };

    return (
        <>
            <select value={currentKey} onChange={handleLayerChange}>
                {Object.keys(models).map((model, idx) => (
                    <option key={model} value={model}>
                        {t("model.layer")} {idx + 1}:{" "}
                        {t(`character.${models[model].character}`)}
                    </option>
                ))}
            </select>
            <div className="layer-buttons">
                <button
                    className="btn-circle btn-white"
                    disabled={isLoading}
                    onClick={() => {
                        setShowAddModelScreen(!showAddModelScreen);
                    }}
                >
                    <i className="bi bi-plus-circle"></i>
                </button>
                {showAddModelScreen && (
                    <AddModelSelect
                        addModel={handleAddLayer}
                        setShow={setShowAddModelScreen}
                    />
                )}
                <UploadImageButton
                    id="background-upload"
                    uploadFunction={handleUploadImage}
                    text={<i className="bi bi-upload"></i>}
                    type="round"
                    disabled={isLoading}
                />
                <button
                    className="btn-circle btn-white"
                    onClick={() => {
                        handleLive2DChange(() => handleDeleteLayer());
                    }}
                    disabled={isLoading}
                >
                    <i className="bi bi-x-circle"></i>
                </button>
            </div>
        </>
    );
};

export default SelectedLayer;
