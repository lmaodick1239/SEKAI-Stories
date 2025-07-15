import React, { useContext, useEffect, useRef, useState } from "react";
import staticCharacterData from "../../character.json";
import sekaiCharacterData from "../../character_sekai.json";
import axios from "axios";
import { SceneContext } from "../../contexts/SceneContext";
import IModel from "../../types/IModel";
import { Live2DModel, Cubism4InternalModel } from "pixi-live2d-display";
import UploadImageButton from "../UI/UploadButton";
import * as PIXI from "pixi.js";
import { Checkbox } from "../UI/Checkbox";
import {
    GetModelDataFromSekai,
    GetModelDataFromStatic,
} from "../../utils/GetModelData";
import { ILive2DModelData } from "../../types/ILive2DModelData";
import { GetCharacterFolder } from "../../utils/GetCharacterFolder";
import { ILive2DModelList } from "../../types/ILive2DModelList";
import AddModelSelect from "../AddModelSelect";
import { useTranslation } from "react-i18next";
import { GetCharacterDataFromSekai } from "../../utils/GetCharacterDataFromSekai";
import { SettingsContext } from "../../contexts/SettingsContext";
import Window from "../UI/Window";
import { ILive2DParameterJsonSave } from "../../types/ILive2DParameterJsonSave";
import { ValidateLive2DParameterJsonSave } from "../../utils/ValidateJsonSave";
import { SoftErrorContext } from "../../contexts/SoftErrorContext";
import { useAudioManager } from "../../utils/useAudioManager";
import {
    virtualEffectParticles,
    virtualEffectCRT,
} from "../../utils/VirtualEffect";
import IEmotionBookmark from "../../types/IEmotionBookmark";
import Live2DInputSlider from "../Live2DInputSlider";

interface StaticCharacterData {
    [key: string]: string[];
}

const typedStaticCharacterData: StaticCharacterData = staticCharacterData;
interface SekaiCharacterData {
    [key: string]: ILive2DModelList[];
}

const typedSekaiCharacterData: SekaiCharacterData = sekaiCharacterData;

const defaultModelBreath = [
    {
        parameterId: "ParamAngleX",
        offset: 0,
        peak: 15,
        cycle: 6.5345,
        weight: 0.5,
    },
    {
        parameterId: "ParamAngleY",
        offset: 0,
        peak: 8,
        cycle: 3.5345,
        weight: 0.5,
    },
    {
        parameterId: "ParamAngleZ",
        offset: 0,
        peak: 10,
        cycle: 5.5345,
        weight: 0.5,
    },
    {
        parameterId: "ParamBodyAngleX",
        offset: 0,
        peak: 4,
        cycle: 15.5345,
        weight: 0.5,
    },
    {
        parameterId: "ParamBreath",
        offset: 0,
        peak: 0.5,
        cycle: 3.2345,
        weight: 0.5,
    },
];

const SNAP = 50;

const ModelSidebar: React.FC = () => {
    const { t } = useTranslation();
    const { playSound } = useAudioManager();
    const scene = useContext(SceneContext);
    const settings = useContext(SettingsContext);
    const softError = useContext(SoftErrorContext);

    if (!scene || !settings || !softError) {
        throw new Error("Context not found");
    }

    const {
        app,
        models,
        text,
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
        initialState,
        setInitialState,
    } = scene;
    const { openAll, setLoading } = settings;
    const { setErrorInformation } = softError;

    const [openTab, setOpenTab] = useState<string>("select-layer");

    const [currentSelectedCharacter, setCurrentSelectedCharacter] =
        useState<string>("");
    const [layerIndex, setLayerIndex] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMsg, setLoadingMsg] = useState<string>("");
    const [showAddModelScreen, setShowAddModelScreen] =
        useState<boolean>(false);
    const [selectedParameter, setSelectedParameter] = useState<{
        idx: number;
        param: string;
    }>({ idx: -1, param: "_" });

    const [coreModel, setCoreModel] = useState<
        Cubism4InternalModel["coreModel"] | null
    >(null);

    const [live2DChangedWarnWindow, setLive2DChangedWarnWindow] =
        useState<boolean>(false);
    const [copiedParametersWindow, setCopiedParametersWindow] =
        useState<boolean>(false);
    const [live2DChangedFunction, setLive2DChangedFunction] = useState<
        (() => void) | undefined
    >(undefined);
    const [bookmarkEmotions, setBookmarkEmotion] = useState<IEmotionBookmark>(
        {}
    );
    const live2dSelect = useRef<null | HTMLSelectElement>(null);

    useEffect(() => {
        if (!models || !currentKey || !currentModel) return;
        const modelKeys = Object.keys(models);
        const currentKeyIndex = modelKeys.indexOf(currentKey);
        const model = models[currentKey];
        setLayerIndex(currentKeyIndex);
        setCurrentModel(model);
        setCurrentSelectedCharacter(model?.character ?? "none");
    }, [models]);

    useEffect(() => {
        if (!models || !currentKey || !currentModel) return;
        if (currentModel?.model instanceof Live2DModel && !isLoading) {
            setCoreModel(
                currentModel.model.internalModel
                    .coreModel as Cubism4InternalModel["coreModel"]
            );
        } else {
            setCoreModel(null);
        }
    }, [currentModel, isLoading]);

    useEffect(() => {
        const bookmarkEmotionsCookie = localStorage.getItem(
            "bookmarkEmotionsCookie"
        );
        const bookmarkEmotionsJson = bookmarkEmotionsCookie
            ? JSON.parse(bookmarkEmotionsCookie)
            : {};

        setBookmarkEmotion(bookmarkEmotionsJson);

        if (text?.hideEverything) {
            setErrorInformation(t("error.hide-everything-warning"));
        }
    }, []);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const select = live2dSelect.current;

            if (!select) return;

            if (e.key === "ArrowLeft") {
                e.preventDefault();
                handleLive2DParamsStep("-", selectedParameter?.param);
                return;
            }
            if (e.key === "ArrowRight") {
                e.preventDefault();
                handleLive2DParamsStep("+", selectedParameter?.param);
                return;
            }

            let nextIndex = 0;
            if (e.key === "ArrowDown") {
                e.preventDefault();
                nextIndex += 1;
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                nextIndex -= 1;
            } else {
                return;
            }

            const toSelectIndex = select.selectedIndex + nextIndex;
            if (toSelectIndex < 0 || toSelectIndex >= select.options.length) {
                return;
            }
            playSound("/sound/slide.wav");
            select.selectedIndex = toSelectIndex;
            select.dispatchEvent(new Event("change", { bubbles: true }));
        };

        if (openTab == "live2d") {
            document.addEventListener("keydown", handler);
        }
        return () => document.removeEventListener("keydown", handler);
    }, [openTab, selectedParameter]);

    if (!models) return t("please-wait");

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

    const copyEmotionParameters = () => {
        if (!coreModel || !currentModel) return;
        coreModel["_parameterIds"].map((param: string) => {
            const value = coreModel.getParameterValueById(param);
            currentModel.parametersChanged[param] = value;
        });
        setCopiedParametersWindow(true);
    };

    const loadModel = async (
        model: string | ILive2DModelList,
        layerIndex: number
    ): Promise<[Live2DModel, ILive2DModelData]> => {
        setLoading(0);
        let modelData: ILive2DModelData | undefined = undefined;
        let modelName: string | undefined = undefined;
        if (typeof model === "string") {
            const [characterFolder] = await GetCharacterFolder(model);

            setLoadingMsg(`${t("loading-1")} ${model}...`);
            modelData = await GetModelDataFromStatic(characterFolder, model);
            modelName = model;
        } else if (
            typeof model === "object" &&
            "modelBase" in model &&
            "modelPath" in model &&
            "modelFile" in model
        ) {
            setLoadingMsg(`${t("loading-1")} ${model.modelBase}...`);
            modelData = await GetModelDataFromSekai(model);
            modelName = model.modelBase;
        }

        if (!modelData) {
            setErrorInformation("Model data is undefined");
            throw new Error("Model data is undefined");
        }

        setLoading(20);
        setLoadingMsg(`${t("loading-4")} ${modelName}...`);
        await axios.get(modelData.url + modelData.FileReferences.Textures[0]);
        setLoading(40);
        setLoadingMsg(`${t("loading-5")} ${modelName}...`);
        await axios.get(modelData.url + modelData.FileReferences.Moc);
        setLoading(60);
        setLoadingMsg(`${t("loading-6")} ${modelName}...`);
        await axios.get(modelData.url + modelData.FileReferences.Physics);

        setLoading(80);
        setLoadingMsg(`${t("loading-7")}...`);
        const live2DModel = await Live2DModel.from(modelData, {
            autoInteract: false,
        });
        live2DModel.scale.set(initialState ? 0.5 : currentModel?.modelScale);
        live2DModel.anchor.set(0.5, 0.5);
        live2DModel.position.set(
            initialState ? 640 : currentModel?.modelX,
            initialState ? 870 : currentModel?.modelY
        );
        live2DModel.angle = currentModel?.modelRotation ?? 0;
        currentModel?.model.destroy();
        modelContainer?.addChildAt(live2DModel, layerIndex);

        setLoading(100);
        setLoadingMsg(``);

        return [live2DModel, modelData];
    };

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
        setCurrentSelectedCharacter("ichika");
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

    const handleLive2DChange = async (fn: () => void) => {
        if (
            currentModel?.parametersChanged &&
            Object.keys(currentModel.parametersChanged).length > 0
        ) {
            setLive2DChangedWarnWindow(true);
            setLive2DChangedFunction(() => fn);
            return;
        }

        fn();
    };

    const handleCharacterChange = async (value: string) => {
        setIsLoading(true);
        const character = value;
        setCurrentSelectedCharacter(character);

        try {
            if (!currentModel) return;

            const isStatic = currentModel.from === "static";
            const characterData = isStatic
                ? staticCharacterData[
                      character as keyof typeof staticCharacterData
                  ]
                : sekaiCharacterData[
                      character as keyof typeof sekaiCharacterData
                  ];

            if (!characterData || characterData.length === 0) {
                setErrorInformation(
                    "No models found for the selected character."
                );
                throw new Error("No models found for the selected character.");
            }

            const firstFile = isStatic
                ? characterData[0]
                : (characterData[0] as ILive2DModelList);

            const [live2DModel, modelData] = await loadModel(
                firstFile,
                layerIndex
            );

            updateModelState({
                character,
                model: live2DModel,
                pose: 99999,
                expression: 99999,
                virtualEffect: false,
                modelName: isStatic
                    ? (firstFile as string)
                    : (firstFile as ILive2DModelList).modelBase,
                modelData,
                visible: true,
                idle: true,
                modelX: initialState ? 640 : currentModel?.modelX,
                modelY: initialState ? 870 : currentModel?.modelY,
                modelScale: initialState ? 0.5 : currentModel?.modelScale,
                parametersChanged: {},
                from:
                    currentModel.from === "upload"
                        ? "sekai"
                        : currentModel.from,
            });
            setSelectedParameter({ idx: -1, param: "_" });
            setInitialState(false);
        } catch (error) {
            setErrorInformation(String(error));
            setLoadingMsg("Failed to load model!");
            setLoading(100);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCostumeChange = async (value: string) => {
        setIsLoading(true);

        const modelBase = value;

        if (!currentModel) return;

        try {
            let live2DModel: Live2DModel;
            let modelData: ILive2DModelData;
            const isStatic = currentModel.from === "static";

            if (isStatic) {
                [live2DModel, modelData] = await loadModel(
                    modelBase,
                    layerIndex
                );
            } else {
                const model = await GetCharacterDataFromSekai(
                    currentSelectedCharacter,
                    modelBase
                );

                if (!model) {
                    setErrorInformation(
                        `No model found for ${modelBase} in sekai data`
                    );
                    throw new Error(
                        `No model found for ${modelBase} in sekai data`
                    );
                }

                [live2DModel, modelData] = await loadModel(model, layerIndex);
            }

            updateModelState({
                character: currentSelectedCharacter,
                model: live2DModel,
                pose: 99999,
                expression: 99999,
                virtualEffect: false,
                modelName: modelBase,
                modelData: modelData,
                visible: true,
                idle: true,
                parametersChanged: {},
                from:
                    currentModel.from === "upload"
                        ? "sekai"
                        : currentModel.from,
            });
            setSelectedParameter({ idx: -1, param: "_" });
        } catch (error) {
            setErrorInformation(String(error));
            setLoadingMsg("Failed to load model!");
            setLoading(100);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVirtualEffect = (value: boolean) => {
        if (!currentModel) return;

        virtualEffectParticles(
            currentModel.model as Live2DModel,
            currentKey,
            app as PIXI.Application,
            value
        );

        if (value && currentModel?.model) {
            const [crtFilter, adjustmentFilter] = virtualEffectCRT();

            currentModel.model.filters = [crtFilter, adjustmentFilter];
        } else {
            if (currentModel?.model) {
                currentModel.model.filters = [];
            }
        }
        updateModelState({
            virtualEffect: value,
        });
    };

    const handleEmotionChange = async (
        event: React.ChangeEvent<HTMLSelectElement>,
        type: "expression" | "pose"
    ) => {
        if (currentModel?.model instanceof Live2DModel) {
            const value = Number(event?.target.value);
            const group =
                type === "expression"
                    ? "Expression"
                    : type === "pose"
                    ? "Motion"
                    : "";
            const selectedOption =
                event.target.options[event.target.selectedIndex].text;
            try {
                currentModel?.model.motion(group, value);
                updateModelState({ [type]: value });
            } catch {
                setLoadingMsg(`Fail to load ${selectedOption}!`);
                setIsLoading(true);
            }
        }
    };

    const handleBookmarkEmotion = async (type: "pose" | "expression") => {
        if (!currentModel) return;

        const key = `${currentModel.from}.${currentModel.character}.${currentModel.modelName}`;
        const emotionValue =
            type === "pose" ? currentModel.pose : currentModel.expression;

        if (!bookmarkEmotions[key]) {
            bookmarkEmotions[key] = {
                pose: [],
                expression: [],
            };
        }

        const emotionArray = bookmarkEmotions[key][type];

        const index = emotionArray.indexOf(emotionValue);
        if (index !== -1) {
            emotionArray.splice(index, 1);
        } else {
            emotionArray.push(emotionValue);
        }

        localStorage.setItem(
            "bookmarkEmotionsCookie",
            JSON.stringify(bookmarkEmotions)
        );
        setBookmarkEmotion({ ...bookmarkEmotions });
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

    const handleLive2DParamsChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        params: string
    ) => {
        const newValue = Number(e.target.value);
        coreModel?.setParameterValueById(params, newValue);
        updateModelState({
            parametersChanged: {
                ...currentModel?.parametersChanged,
                [params]: newValue,
            },
        });
    };

    const handleLive2DParamsStep = (type: string, params: string) => {
        let newValue: number = 0;
        const currentValue = coreModel?.getParameterValueById(params) ?? 0;
        const step = 0.1;
        switch (type) {
            case "+":
                newValue = currentValue + step;
                break;
            case "-":
                newValue = currentValue - step;
                break;
            case "0":
                newValue = 0;
                break;
            default:
                newValue = currentValue;
        }
        coreModel?.setParameterValueById(params, newValue);
        updateModelState({
            parametersChanged: {
                ...currentModel?.parametersChanged,
                [params]: newValue,
            },
        });
    };

    const handleIdle = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.checked;
        if (
            currentModel?.model instanceof Live2DModel &&
            "breath" in currentModel.model.internalModel
        ) {
            const modelBreath = currentModel.model.internalModel
                .breath as Cubism4InternalModel["breath"];
            modelBreath.setParameters(value ? defaultModelBreath : []);
            updateModelState({ idle: value });
        }
    };

    const handleImportLive2DParams = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async (event) => {
                const jsonString = event.target?.result;
                if (typeof jsonString === "string") {
                    const data: ILive2DParameterJsonSave =
                        JSON.parse(jsonString);
                    if (ValidateLive2DParameterJsonSave(data)) {
                        const newParams: Record<string, number> = {};
                        Object.entries(data).forEach(([name, value]) => {
                            try {
                                coreModel?.setParameterValueById(name, value);
                                console.log(name, value);
                                newParams[name] = value;
                            } catch {
                                return;
                            }
                        });
                        updateModelState({
                            parametersChanged: {
                                ...currentModel?.parametersChanged,
                                ...newParams,
                            },
                        });
                    } else {
                        setErrorInformation(t("error.invalid-json"));
                    }
                }
            };
            reader.readAsText(file);
        };
        input.click();
        input.remove();
    };

    const handleExportLive2DParams = () => {
        const data = currentModel?.parametersChanged;
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${currentModel?.character ?? "character"}_live2d.json`;
        a.click();
        a.remove();
    };

    return (
        <div>
            <h1>{t("model.header")}</h1>
            <div
                className="option"
                onClick={() => {
                    setOpenTab("select-layer");
                }}
            >
                <div className="space-between flex-horizontal center">
                    <h2>{t("model.selected-layer")}</h2>
                    {openAll || openTab === "select-layer" ? (
                        <i className="bi bi-caret-down-fill" />
                    ) : (
                        <i className="bi bi-caret-right-fill" />
                    )}
                </div>
                {(openAll || openTab === "select-layer") && (
                    <div className="option__content">
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
                                    handleLive2DChange(() =>
                                        handleDeleteLayer()
                                    );
                                }}
                                disabled={isLoading}
                            >
                                <i className="bi bi-x-circle"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {loadingMsg && (
                <div className="option">
                    <p>{loadingMsg}</p>
                    {currentModel?.from === "sekai" &&
                        currentModel?.character != "others" && (
                            <p>
                                <br />
                                {t("model.long-wait")}
                            </p>
                        )}
                </div>
            )}
            <div className="option" onClick={() => setOpenTab("character")}>
                <div className="space-between flex-horizontal center">
                    <h2>{t("model.character")}</h2>
                    {openAll || openTab === "character" ? (
                        <i className="bi bi-caret-down-fill" />
                    ) : (
                        <i className="bi bi-caret-right-fill" />
                    )}
                </div>
                {(openAll || openTab === "character") && (
                    <div className="option__content">
                        <select
                            value={currentSelectedCharacter}
                            onChange={(e) => {
                                const value = e.target.value;
                                handleLive2DChange(() =>
                                    handleCharacterChange(value)
                                );
                            }}
                            disabled={isLoading}
                        >
                            <option value="none" disabled>
                                {t("model.select-character")}
                            </option>
                            {currentSelectedCharacter === "custom" && (
                                <option value="custom" disabled>
                                    {t("character.custom")}
                                </option>
                            )}
                            {Object.keys(
                                currentModel?.from === "static"
                                    ? staticCharacterData
                                    : sekaiCharacterData
                            ).map((character) => (
                                <option key={character} value={character}>
                                    {t(`character.${character}`)}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
            {(currentModel?.model instanceof Live2DModel ||
                currentModel?.character == "none") && (
                <>
                    <div
                        className="option"
                        onClick={() => setOpenTab("costume")}
                    >
                        <div className="space-between flex-horizontal center">
                            <h2>{t("model.costume")}</h2>
                            {openAll || openTab === "costume" ? (
                                <i className="bi bi-caret-down-fill" />
                            ) : (
                                <i className="bi bi-caret-right-fill" />
                            )}
                        </div>

                        {(openAll || openTab === "costume") && (
                            <div className="option__content">
                                <select
                                    value={currentModel?.modelName}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        handleLive2DChange(() =>
                                            handleCostumeChange(value)
                                        );
                                    }}
                                    disabled={isLoading}
                                >
                                    {(currentModel.from === "static"
                                        ? typedStaticCharacterData[
                                              currentSelectedCharacter
                                          ]
                                        : typedSekaiCharacterData[
                                              currentSelectedCharacter
                                          ]
                                    )?.map((model, idx) => {
                                        const value =
                                            currentModel.from === "static"
                                                ? (model as string)
                                                : (model as ILive2DModelList)
                                                      .modelBase;
                                        return (
                                            <option
                                                key={`${value}${idx}`}
                                                value={value}
                                            >
                                                {value}
                                            </option>
                                        );
                                    })}
                                </select>
                                <Checkbox
                                    id="virtual-effect"
                                    label={t("model.virtual")}
                                    checked={currentModel.virtualEffect}
                                    onChange={(event) => {
                                        const value = event.target.checked;
                                        handleVirtualEffect(value);
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div
                        className="option"
                        onClick={() => {
                            setOpenTab("emotion");
                        }}
                    >
                        <div className="space-between flex-horizontal center">
                            <h2>{t("model.emotion")}</h2>
                            {openAll || openTab === "emotion" ? (
                                <i className="bi bi-caret-down-fill" />
                            ) : (
                                <i className="bi bi-caret-right-fill" />
                            )}
                        </div>
                        {(openAll || openTab === "emotion") && (
                            <>
                                <div className="option__content">
                                    <h3>{t("model.pose")}</h3>
                                    <div className="space-between flex-horizontal relative">
                                        <select
                                            value={currentModel?.pose}
                                            onChange={(e) => {
                                                handleEmotionChange(e, "pose");
                                            }}
                                        >
                                            <option value={99999} disabled>
                                                {t("model.select-pose")}
                                            </option>
                                            {bookmarkEmotions[
                                                `${currentModel.from}.${currentModel.character}.${currentModel.modelName}`
                                            ] &&
                                                bookmarkEmotions[
                                                    `${currentModel.from}.${currentModel.character}.${currentModel.modelName}`
                                                ].pose.map((idx) => (
                                                    <option
                                                        key={`faved-${idx}`}
                                                        value={idx}
                                                    >
                                                        ★{" "}
                                                        {
                                                            currentModel
                                                                .modelData
                                                                ?.FileReferences
                                                                .Motions.Motion[
                                                                idx
                                                            ].Name
                                                        }
                                                    </option>
                                                ))}
                                            {currentModel &&
                                                currentModel.modelData?.FileReferences.Motions.Motion.map(
                                                    (o, idx) => (
                                                        <option
                                                            key={idx}
                                                            value={idx}
                                                        >
                                                            {o.Name}
                                                        </option>
                                                    )
                                                )}
                                        </select>
                                        {currentModel?.pose !== 99999 && (
                                            <button
                                                className="btn-circle btn-white absolute right"
                                                onClick={() =>
                                                    handleBookmarkEmotion(
                                                        "pose"
                                                    )
                                                }
                                            >
                                                {bookmarkEmotions[
                                                    `${currentModel.from}.${currentModel.character}.${currentModel.modelName}`
                                                ] &&
                                                bookmarkEmotions[
                                                    `${currentModel.from}.${currentModel.character}.${currentModel.modelName}`
                                                ].pose.includes(
                                                    currentModel.pose
                                                ) ? (
                                                    <i className="bi bi-star-fill sidebar__select" />
                                                ) : (
                                                    <i className="bi bi-star sidebar__select" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                    <button
                                        className="btn-regular btn-blue btn-extend-width"
                                        onClick={async () => {
                                            if (
                                                currentModel &&
                                                currentModel.model instanceof
                                                    Live2DModel &&
                                                currentModel.pose !== 99999
                                            ) {
                                                currentModel.model.motion(
                                                    "Motion",
                                                    currentModel.pose
                                                );
                                            }
                                        }}
                                    >
                                        {t("model.re-apply")}
                                    </button>
                                </div>
                                <div className="option__content">
                                    <h3>{t("model.expression")}</h3>
                                    <div className="space-between flex-horizontal relative">
                                        <select
                                            value={currentModel?.expression}
                                            onChange={(e) => {
                                                handleEmotionChange(
                                                    e,
                                                    "expression"
                                                );
                                            }}
                                        >
                                            <option value={99999} disabled>
                                                {t("model.select-expression")}
                                            </option>
                                            {bookmarkEmotions[
                                                `${currentModel.from}.${currentModel.character}.${currentModel.modelName}`
                                            ] &&
                                                bookmarkEmotions[
                                                    `${currentModel.from}.${currentModel.character}.${currentModel.modelName}`
                                                ].expression.map((idx) => (
                                                    <option
                                                        key={`faved-${idx}`}
                                                        value={idx}
                                                    >
                                                        ★{" "}
                                                        {
                                                            currentModel
                                                                .modelData
                                                                ?.FileReferences
                                                                .Motions
                                                                .Expression[idx]
                                                                .Name
                                                        }
                                                    </option>
                                                ))}
                                            {currentModel &&
                                                currentModel.modelData?.FileReferences.Motions.Expression.map(
                                                    (o, idx) => (
                                                        <option
                                                            key={idx}
                                                            value={idx}
                                                        >
                                                            {o.Name}
                                                        </option>
                                                    )
                                                )}
                                        </select>
                                        {currentModel?.expression !== 99999 && (
                                            <button
                                                className="btn-circle btn-white absolute right"
                                                onClick={() =>
                                                    handleBookmarkEmotion(
                                                        "expression"
                                                    )
                                                }
                                            >
                                                {bookmarkEmotions[
                                                    `${currentModel.from}.${currentModel.character}.${currentModel.modelName}`
                                                ] &&
                                                bookmarkEmotions[
                                                    `${currentModel.from}.${currentModel.character}.${currentModel.modelName}`
                                                ].expression.includes(
                                                    currentModel.expression
                                                ) ? (
                                                    <i className="bi bi-star-fill sidebar__select" />
                                                ) : (
                                                    <i className="bi bi-star sidebar__select" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                    <button
                                        className="btn-regular btn-blue btn-extend-width"
                                        onClick={async () => {
                                            if (
                                                currentModel &&
                                                currentModel.model instanceof
                                                    Live2DModel &&
                                                currentModel.expression !==
                                                    99999
                                            ) {
                                                currentModel.model.motion(
                                                    "Expression",
                                                    currentModel.expression
                                                );
                                            }
                                        }}
                                    >
                                        {t("model.re-apply")}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
            <div className="option" onClick={() => setOpenTab("transform")}>
                <div className="space-between flex-horizontal center">
                    <h2>{t("model.transform")}</h2>
                    {openAll || openTab === "transform" ? (
                        <i className="bi bi-caret-down-fill" />
                    ) : (
                        <i className="bi bi-caret-right-fill" />
                    )}
                </div>
                {(openAll || openTab === "transform") && (
                    <>
                        <div className="option__content">
                            <div className="transform-icons">
                                <h3>
                                    {t("model.x-position")} (
                                    {currentModel?.modelX}px)
                                </h3>
                                <div>
                                    <i
                                        className="bi bi-pencil-fill"
                                        onClick={() =>
                                            handleTransformChange("x")
                                        }
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
                                    {t("model.y-position")} (
                                    {currentModel?.modelY}px)
                                </h3>
                                <div>
                                    <i
                                        className="bi bi-pencil-fill"
                                        onClick={() =>
                                            handleTransformChange("y")
                                        }
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
                                    {t("model.scale")} (
                                    {currentModel?.modelScale})
                                </h3>
                                <div>
                                    <i
                                        className="bi bi-pencil-fill"
                                        onClick={() =>
                                            handleTransformChange("scale")
                                        }
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
                                    {t("model.rotation")} (
                                    {currentModel?.modelRotation})
                                </h3>
                                <div>
                                    <i
                                        className="bi bi-pencil-fill"
                                        onClick={() =>
                                            handleTransformChange("rotation")
                                        }
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
                                        handleLive2DChange(() =>
                                            handleMoveLayer("forward")
                                        );
                                    }}
                                >
                                    <i className="bi bi-front"></i>
                                </button>
                                <button
                                    className="btn-circle btn-white"
                                    onClick={() => {
                                        handleLive2DChange(() =>
                                            handleMoveLayer("backward")
                                        );
                                    }}
                                >
                                    <i className="bi bi-back"></i>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {currentModel?.model instanceof Live2DModel && !isLoading && (
                <>
                    <div
                        className="option"
                        onClick={() => {
                            setOpenTab("mouth");
                        }}
                    >
                        <div className="space-between flex-horizontal center">
                            <h2>{t("model.mouth")}</h2>
                            {openAll || openTab === "mouth" ? (
                                <i className="bi bi-caret-down-fill" />
                            ) : (
                                <i className="bi bi-caret-right-fill" />
                            )}
                        </div>
                        {(openAll || openTab === "mouth") && (
                            <div className="option__content">
                                {coreModel &&
                                    coreModel["_parameterIds"]
                                        .map((param: string, idx: number) => {
                                            if (!param.includes("Mouth"))
                                                return;
                                            return (
                                                <Live2DInputSlider
                                                    idx={idx}
                                                    param={param}
                                                    coreModel={coreModel}
                                                    onChange={
                                                        handleLive2DParamsChange
                                                    }
                                                    currentModel={currentModel}
                                                    filter
                                                />
                                            );
                                        })
                                        .filter(Boolean)}
                            </div>
                        )}
                    </div>
                    <div
                        className="option"
                        onClick={() => {
                            setOpenTab("live2d");
                        }}
                    >
                        <div className="space-between flex-horizontal center">
                            <h2>{t("model.live2d")}</h2>
                            {openAll || openTab === "live2d" ? (
                                <i className="bi bi-caret-down-fill" />
                            ) : (
                                <i className="bi bi-caret-right-fill" />
                            )}
                        </div>
                        {(openAll || openTab === "live2d") && (
                            <div className="option__content">
                                <h3>{t("model.parameters")}</h3>
                                {window.matchMedia &&
                                    window.matchMedia("(pointer: fine)")
                                        .matches && (
                                        <div>
                                            <p>{t("model.live2d-tooltip")}</p>
                                        </div>
                                    )}
                                {coreModel && (
                                    <>
                                        <select
                                            name="parameters"
                                            id="parameters"
                                            onChange={(e) => {
                                                const [param, idx] =
                                                    e.target.value.split(",");
                                                setSelectedParameter({
                                                    idx: Number(idx),
                                                    param,
                                                });
                                            }}
                                            value={`${selectedParameter?.param},${selectedParameter?.idx}`}
                                            ref={live2dSelect}
                                        >
                                            <option value="_,-1" disabled>
                                                {t("model.select-parameter")}
                                            </option>
                                            {coreModel["_parameterIds"].map(
                                                (
                                                    param: string,
                                                    idx: number
                                                ) => (
                                                    <option
                                                        value={`${param},${idx}`}
                                                        key={idx}
                                                    >
                                                        {param}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                        {selectedParameter &&
                                            selectedParameter.idx != -1 && (
                                                <>
                                                    <Live2DInputSlider
                                                        idx={
                                                            selectedParameter?.idx
                                                        }
                                                        param={
                                                            selectedParameter?.param
                                                        }
                                                        coreModel={coreModel}
                                                        onChange={
                                                            handleLive2DParamsChange
                                                        }
                                                        currentModel={
                                                            currentModel
                                                        }
                                                    />

                                                    <div className="layer-buttons">
                                                        <button
                                                            className="btn-circle btn-white"
                                                            onClick={() => {
                                                                handleLive2DParamsStep(
                                                                    "-",
                                                                    selectedParameter?.param
                                                                );
                                                            }}
                                                        >
                                                            <i className="bi bi-caret-left-fill" />
                                                        </button>
                                                        <button
                                                            className="btn-circle btn-white"
                                                            onClick={() => {
                                                                handleLive2DParamsStep(
                                                                    "0",
                                                                    selectedParameter?.param
                                                                );
                                                            }}
                                                        >
                                                            <i className="bi bi-arrow-clockwise" />
                                                        </button>
                                                        <button
                                                            className="btn-circle btn-white"
                                                            onClick={() => {
                                                                handleLive2DParamsStep(
                                                                    "+",
                                                                    selectedParameter?.param
                                                                );
                                                            }}
                                                        >
                                                            <i className="bi bi-caret-right-fill" />
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                    </>
                                )}
                                <div className="option__content">
                                    <h3>{t("model.toggles")}</h3>
                                    <Checkbox
                                        label={t("model.idle")}
                                        checked={currentModel.idle}
                                        id="idle"
                                        onChange={handleIdle}
                                    />
                                </div>
                                <div className="option__content">
                                    <h3>{t("model.import-export")}</h3>
                                    <p>
                                        {t(
                                            "model.live2d-import-export-description"
                                        )}
                                    </p>
                                    <div>
                                        <button
                                            className="btn-regular btn-100 btn-blue"
                                            onClick={handleImportLive2DParams}
                                        >
                                            {t("model.import")}
                                        </button>
                                        <button
                                            className="btn-regular btn-100 btn-blue"
                                            onClick={handleExportLive2DParams}
                                        >
                                            {t("model.export")}
                                        </button>
                                    </div>
                                </div>
                                <div className="option__content">
                                    <h3>{t("model.emotion-copy")}</h3>
                                    <p>{t("model.emotion-copy-description")}</p>
                                    <div>
                                        <button
                                            className="btn-regular btn-100 btn-blue"
                                            onClick={copyEmotionParameters}
                                        >
                                            {t("model.copy")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
            {live2DChangedWarnWindow && (
                <Window
                    show={setLive2DChangedWarnWindow}
                    confirmFunction={live2DChangedFunction}
                    confirmLabel={t("continue-ok")}
                    danger
                >
                    <div className="window__content">
                        <div className="window__divider">
                            <h3 className="text-center">
                                {t("model.live2d-changed-warn")}
                            </h3>
                        </div>
                    </div>
                </Window>
            )}

            {copiedParametersWindow && (
                <Window show={setCopiedParametersWindow} id="export-screen">
                    <div className="window__content">
                        <h1>{t("model.emotion-copy-confirm-header")}</h1>
                        <p>{t("model.emotion-copy-confirm-description")}</p>
                        <textarea
                            name=""
                            id=""
                            value={JSON.stringify(
                                currentModel?.parametersChanged,
                                null,
                                2
                            )}
                            readOnly
                        ></textarea>
                    </div>
                </Window>
            )}
        </div>
    );
};

export default ModelSidebar;
