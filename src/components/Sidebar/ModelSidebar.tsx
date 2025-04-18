import React, { useContext, useEffect, useState } from "react";
import characterData from "../../character.json";
import axios from "axios";
import { AppContext } from "../../contexts/AppContext";
import IModel from "../../types/IModel";
import GetMotionList, {
    IData,
    IExpressionPoseList,
} from "../../utils/GetMotionList";
import { Live2DModel } from "pixi-live2d-display";

interface CharacterData {
    [key: string]: string[];
}

const typedCharacterData: CharacterData = characterData;

interface ModelSidebarProps {
    message?: string;
}

const ModelSidebar: React.FC<ModelSidebarProps> = () => {
    const context = useContext(AppContext);
    const [poseFile, setPoseFile] = useState<IData | undefined>(undefined);
    const [currentModel, setCurrentModel] = useState<IModel | undefined>(
        undefined
    );
    const [currentKey, setCurrentKey] = useState<string>("");
    const [currentSelectedCharacter, setCurrentSelectedCharacter] =
        useState<string>("");
    const [layerIndex, setLayerIndex] = useState<number>(0);

    const getPoseFile = async (filename: string) => {
        const data = await (
            await axios.get(`/models/${filename}/${filename}.model3.json`)
        ).data;
        const poseFile = await GetMotionList(filename, data);
        setPoseFile(poseFile);
    };

    const updateModelState = (updates: Partial<IModel>) => {
        setModels((prevModels) => ({
            ...prevModels,
            [currentKey]: {
                ...currentModel!,
                ...updates,
            },
        }));
        setCurrentModel((prevModel) => ({
            ...prevModel!,
            ...updates,
        }));
    };
    const newModel = async (filename: string, layerIndex: number) => {
        const getmodel = await axios.get(
            `/models/${filename}/${filename}.model3.json`
        );
        const data = GetMotionList(filename, getmodel.data);
        const live2DModel = await Live2DModel.from(data, {
            autoInteract: false,
        });
        live2DModel.scale.set(0.3);
        modelContainer?.addChildAt(live2DModel, layerIndex);
        return live2DModel;
    };

    const loadModel = async (
        filename: string,
        layerIndex: number
    ): Promise<Live2DModel> => {
        const getmodel = await axios.get(
            `/models/${filename}/${filename}.model3.json`
        );
        const data = GetMotionList(filename, getmodel.data);
        const live2DModel = await Live2DModel.from(data, {
            autoInteract: false,
        });
        live2DModel.scale.set(currentModel?.modelScale);
        live2DModel.position.set(currentModel?.modelX, currentModel?.modelY);
        currentModel?.model.destroy();
        modelContainer?.addChildAt(live2DModel, layerIndex);

        return live2DModel;
    };

    useEffect(() => {
        if (!context?.models || currentKey) return;
        const entries = Object.entries(context.models);
        if (entries.length === 0) return;

        const [firstKey, firstModel] = entries[0];
        setCurrentKey(firstKey);
        setCurrentModel(firstModel);
        setCurrentSelectedCharacter(firstModel.character);
        getPoseFile(firstModel.file);
    }, [context?.models, currentKey]);

    if (!context || !context.models) {
        return "Please wait...";
    }

    const {
        models,
        setModels,
        modelContainer,
        nextLayer,
        setNextLayer,
        layers,
        setLayers,
    } = context;

    const handleLayerChange = async (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const key = event?.target.value;
        const selectedIndex = event.target.selectedIndex;
        setCurrentKey(key);
        setCurrentModel(models[key]);
        setCurrentSelectedCharacter(models[key].character);
        setLayerIndex(selectedIndex);
        getPoseFile(models[key].file);
    };

    const handleAddLayer = async () => {
        if (layers >= 3) {
            const confirmation = confirm(
                "Adding more than three layers may prevent other models from rendering properly and could cause lag. Do you want to continue?\n\nClicking OK will proceed the action."
            );
            if (!confirmation) return;
        }
        const filename = "01ichika_cloth001";
        const live2DModel = await newModel(filename, layers);
        const newLayer = {
            [`character${nextLayer + 1}`]: {
                character: "ichika",
                file: filename,
                model: live2DModel,
                modelX: live2DModel.x,
                modelY: live2DModel.y,
                modelScale: live2DModel.scale.x,
                expression: 99999,
                pose: 99999,
            },
        };
        setModels((prevModels) => ({
            ...prevModels,
            ...newLayer,
        }));
        setCurrentKey(`character${nextLayer + 1}`);
        setCurrentModel(newLayer[`character${nextLayer + 1}`]);
        setCurrentSelectedCharacter("ichika");
        setLayerIndex(layers);
        getPoseFile(filename);
        setNextLayer(nextLayer + 1);
        setLayers(layers + 1);
    };
    console.log(currentModel)
    const handleDeleteLayer = async () => {
        const modelsObjects = Object.entries(context.models);
        if (modelsObjects.length == 1) {
            alert("This is the only layer and cannot be deleted.");
            return;
        }
        currentModel?.model.destroy();
        delete models[currentKey];
        const firstKey = Object.keys(models)[0];
        setCurrentKey(firstKey);
        setCurrentModel(models[firstKey]);
        setCurrentSelectedCharacter(models[firstKey].character);
        setLayerIndex(0);
        setLayers(layers - 1);
        getPoseFile(models[firstKey].file);
    };

    const handleCharacterChange = async (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const character = event?.target.value;
        setCurrentSelectedCharacter(character);
        const firstfile =
            characterData[character as keyof typeof characterData][0];
        const live2DModel = await loadModel(firstfile, layerIndex);
        updateModelState({
            character: character,
            model: live2DModel,
            pose: 99999,
            expression: 99999,
            file: firstfile,
        });
        getPoseFile(firstfile);
    };

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const filename = event?.target.value;
        const live2DModel = await loadModel(filename, layerIndex);
        updateModelState({
            character: currentSelectedCharacter,
            model: live2DModel,
            pose: 99999,
            expression: 99999,
            file: filename,
        });
    };

    const handlePoseChange = async (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const pose = Number(event?.target.value);
        currentModel?.model.motion("Pose", pose);
        updateModelState({ pose });
    };

    const handleExpressionChange = async (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const expression = Number(event?.target.value);
        currentModel?.model.motion("Expression", expression);
        updateModelState({ expression });
    };

    const handleXTransform = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const x = Number(event?.target.value);
        currentModel?.model.position.set(x, currentModel.modelY);
        updateModelState({ modelX: x });
    };

    const handleYTransform = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const y = Number(event?.target.value);
        currentModel?.model.position.set(currentModel.modelX, y);
        updateModelState({ modelY: y });
    };

    const handleScaleTransform = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const scale = Number(event?.target.value);
        currentModel?.model.scale.set(currentModel.modelScale, scale);
        updateModelState({ modelScale: scale });
    };

    return (
        <div>
            <h1>Model</h1>
            <div className="option">
                <h2>Selected Layer</h2>
                <div className="option__content">
                    <select value={currentKey} onChange={handleLayerChange}>
                        {Object.keys(models).map((model, idx) => (
                            <option key={model} value={model}>
                                Layer {idx + 1}: {models[model].character.charAt(0).toUpperCase() + models[model].character.slice(1)}
                            </option>
                        ))}
                    </select>
                    <div id="layer-buttons">
                        <button
                            className="btn-circle btn-white"
                            onClick={handleAddLayer}
                        >
                            <i className="bi bi-plus-circle"></i>
                        </button>
                        <button
                            className="btn-circle btn-white"
                            onClick={handleDeleteLayer}
                        >
                            <i className="bi bi-trash3"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className="option">
                <h2>Character</h2>
                <div className="option__content">
                    <select
                        value={currentSelectedCharacter}
                        onChange={handleCharacterChange}
                    >
                        {Object.keys(characterData).map((character) => (
                            <option key={character} value={character}>
                                {character.charAt(0).toUpperCase() + character.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="option">
                <h2>Costume</h2>
                <div className="option__content">
                    <select
                        value={currentModel?.file}
                        onChange={handleFileChange}
                    >
                        {currentSelectedCharacter &&
                            typedCharacterData[currentSelectedCharacter]?.map(
                                (file: string) => (
                                    <option key={file} value={file}>
                                        {file}
                                    </option>
                                )
                            )}
                    </select>
                </div>
            </div>
            <div className="option">
                <h2>Emotion</h2>
                <div className="option__content">
                    <h3>Pose</h3>
                    <select
                        value={currentModel?.pose}
                        onChange={handlePoseChange}
                    >
                        <option value={99999} disabled>
                            Select a pose
                        </option>
                        {poseFile &&
                            poseFile.FileReferences.Motions.Pose.map(
                                (o: IExpressionPoseList, idx) => (
                                    <option key={idx} value={idx}>
                                        {o.Name}
                                    </option>
                                )
                            )}
                    </select>
                    <button
                        className="btn-regular btn-blue btn-extend-width"
                        onClick={async () => {
                            if (currentModel && currentModel.pose !== 99999) {
                                currentModel.model.motion("Pose", currentModel.pose);
                            }
                        }}
                    >
                        Re-apply
                    </button>
                </div>
                <div className="option__content">
                    <h3>Expression</h3>
                    <select
                        value={currentModel?.expression}
                        onChange={handleExpressionChange}
                    >
                        <option value={99999} disabled>
                            Select an expression
                        </option>
                        {poseFile &&
                            poseFile.FileReferences.Motions.Expression.map(
                                (o: IExpressionPoseList, idx) => (
                                    <option key={idx} value={idx}>
                                        {o.Name}
                                    </option>
                                )
                            )}
                    </select>
                    <button
                        className="btn-regular btn-blue btn-extend-width"
                        onClick={async () => {
                            if (currentModel && currentModel.expression !== 99999) {
                                currentModel.model.motion("Expression", currentModel.expression);
                            }
                        }}
                    >
                        Re-apply
                    </button>
                </div>
            </div>
            <div className="option">
                <h2>Transform</h2>
                <div className="option__content">
                    <h3>X-Position</h3>
                    <input
                        type="range"
                        name="x-value"
                        id="x-value"
                        min={-720}
                        max={1720}
                        value={currentModel?.modelX}
                        onChange={handleXTransform}
                    />
                </div>
                <div className="option__content">
                    <h3>Y-Position</h3>
                    <input
                        type="range"
                        name="x-value"
                        id="x-value"
                        min={-1280}
                        max={1280}
                        value={currentModel?.modelY}
                        onChange={handleYTransform}
                    />
                </div>
                <div className="option__content">
                    <h3>Scale</h3>
                    <input
                        type="range"
                        name="x-value"
                        id="x-value"
                        min={0}
                        max={1}
                        step={0.01}
                        value={currentModel?.modelScale}
                        onChange={handleScaleTransform}
                    />
                </div>
            </div>
        </div>
    );
};

export default ModelSidebar;
