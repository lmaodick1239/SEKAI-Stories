import React, { useContext, useEffect, useRef, useState } from "react";
import staticCharacterData from "../../character.json";
import sekaiCharacterData from "../../character_sekai.json";
import axios from "axios";
import { SceneContext } from "../../contexts/SceneContext";
import IModel from "../../types/IModel";
import { Live2DModel, Cubism4InternalModel } from "pixi-live2d-display";
import UploadImageButton from "../UploadButton";
import * as PIXI from "pixi.js";
import { Checkbox } from "../Checkbox";
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
import { AdjustmentFilter, CRTFilter } from "pixi-filters";

interface StaticCharacterData {
    [key: string]: string[];
}

const typedStaticCharacterData: StaticCharacterData = staticCharacterData;
interface SekaiCharacterData {
    [key: string]: ILive2DModelList[];
}

const typedSekaiCharacterData: SekaiCharacterData = sekaiCharacterData;

interface ModelSidebarProps {
    message?: string;
}

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

const ModelSidebar: React.FC<ModelSidebarProps> = () => {
    const { t } = useTranslation();

    const context = useContext(SceneContext);

    const [openTab, setOpenTab] = useState<string>("select-layer");
    const [currentModel, setCurrentModel] = useState<IModel | undefined>(
        undefined
    );
    const [currentKey, setCurrentKey] = useState<string>("");
    const [currentSelectedCharacter, setCurrentSelectedCharacter] =
        useState<string>("");
    const [layerIndex, setLayerIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMsg, setLoadingMsg] = useState<string>(
        "We are Project Sekai"
    );
    const [showAddModelScreen, setShowAddModelScreen] =
        useState<boolean>(false);
    const [selectedParameter, setSelectedParameter] = useState<{
        idx: number;
        param: string;
    }>({ idx: -1, param: "_" });

    const [coreModel, setCoreModel] = useState<
        Cubism4InternalModel["coreModel"] | null
    >(null);
    const [parameterValues, setParameterValues] = useState<
        Record<string, number>
    >({});

    const characterSelect = useRef<null | HTMLSelectElement>(null);
    const modelSelect = useRef<null | HTMLSelectElement>(null);

    useEffect(() => {
        if (!context?.models || currentKey) return;
        const entries = Object.entries(context.models);
        if (entries.length === 0) return;

        const [firstKey, firstModel] = entries[0];
        setCurrentKey(firstKey);
        setCurrentModel(firstModel);
        setCurrentSelectedCharacter(firstModel.character);
    }, [context?.models, currentKey]);

    useEffect(() => {
        console.log(currentModel);
        if (currentModel?.model instanceof Live2DModel && !loading) {
            setCoreModel(
                currentModel.model.internalModel
                    .coreModel as Cubism4InternalModel["coreModel"]
            );
        } else {
            setCoreModel(null);
        }
    }, [currentModel, loading]);

    if (!context || !context.models) {
        return t("please-wait");
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

    const loadModel = async (
        model: string | ILive2DModelList,
        layerIndex: number
    ): Promise<[Live2DModel, ILive2DModelData]> => {
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
            throw new Error("Model data is undefined");
        }

        await axios.get(modelData.url + modelData.FileReferences.Textures[0]);
        setLoadingMsg(`${t("loading-5")} ${modelName}...`);
        await axios.get(modelData.url + modelData.FileReferences.Moc);
        setLoadingMsg(`${t("loading-6")} ${modelName}...`);
        await axios.get(modelData.url + modelData.FileReferences.Physics);

        setLoadingMsg(`${t("loading-7")}...`);
        const live2DModel = await Live2DModel.from(modelData, {
            autoInteract: false,
        });
        live2DModel.scale.set(currentModel?.modelScale);
        live2DModel.position.set(currentModel?.modelX, currentModel?.modelY);
        currentModel?.model.destroy();
        modelContainer?.addChildAt(live2DModel, layerIndex);

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
        setParameterValues({});
    };

    const handleAddLayer = async (from: string) => {
        if (layers >= 5) {
            const confirmation = confirm(
                "Adding more than five layers may prevent other models from rendering properly and could cause lag. Do you want to continue?\n\nClicking OK will proceed the action."
            );
            if (!confirmation) return;
        }
        const modelName = "none";
        const texture = await PIXI.Texture.fromURL(
            "/background/Background_New_Layer.png"
        );
        const sprite = new PIXI.Sprite(texture);
        modelContainer?.addChildAt(sprite, layers);
        const newLayer = {
            [`character${nextLayer + 1}`]: {
                character: "none",
                modelName: modelName,
                model: sprite,
                modelX: -200,
                modelY: -280,
                modelScale: 0.5,
                virtualEffect: false,
                expression: 99999,
                pose: 99999,
                idle: true,
                visible: true,
                modelData: undefined,
                from: from,
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
    };

    const handleUploadImage = async (file: File) => {
        const imgSrc = URL.createObjectURL(file);
        const modelName = imgSrc;
        const texture = await PIXI.Texture.fromURL(modelName);
        const sprite = new PIXI.Sprite(texture);
        modelContainer?.addChildAt(sprite, layerIndex);
        const newLayer = {
            [`character${nextLayer + 1}`]: {
                character: "custom",
                modelName: modelName,
                model: sprite,
                modelX: sprite.x,
                modelY: sprite.y,
                modelScale: sprite.scale.x,
                virtualEffect: false,
                expression: 99999,
                pose: 99999,
                idle: true,
                visible: true,
                modelData: undefined,
                from: "upload",
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
        const modelsObjects = Object.entries(context.models ?? {});
        if (modelsObjects.length == 1) {
            alert(t("model.delete-model-warn"));
            return;
        }
        setLoading(true);
        setCoreModel(null);
        currentModel?.model.destroy();
        delete models[currentKey];
        const firstKey = Object.keys(models)[0];
        setCurrentKey(firstKey);
        setCurrentModel(models[firstKey]);
        setCurrentSelectedCharacter(models[firstKey].character);
        setLayerIndex(0);
        setLayers(layers - 1);
        setLoading(false);
        setParameterValues({});
        setSelectedParameter({ idx: -1, param: "_" });
    };

    const handleCharacterChange = async (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setLoading(true);
        const character = event?.target.value;
        setCurrentSelectedCharacter(character);
        if (characterSelect.current && modelSelect.current) {
            characterSelect.current.disabled = true;
            modelSelect.current.disabled = true;
        }
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
            });
            setLoading(false);
            setParameterValues({});
            setSelectedParameter({ idx: -1, param: "_" });
        } catch {
            setLoadingMsg("Failed to load model!");
        } finally {
            if (characterSelect.current && modelSelect.current) {
                characterSelect.current.disabled = false;
                modelSelect.current.disabled = false;
            }
        }
    };

    const handleCostumeChange = async (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setLoading(true);
        const modelBase = event?.target.value;

        if (!currentModel) return;
        if (characterSelect.current && modelSelect.current) {
            characterSelect.current.disabled = true;
            modelSelect.current.disabled = true;
        }
        try {
            let live2DModel: Live2DModel;
            let modelData: ILive2DModelData;

            switch (currentModel.from) {
                case "static":
                    [live2DModel, modelData] = await loadModel(
                        modelBase,
                        layerIndex
                    );
                    break;
                case "sekai": {
                    const model = await GetCharacterDataFromSekai(
                        currentSelectedCharacter,
                        modelBase
                    );

                    if (!model) {
                        throw new Error(
                            `No model found for ${modelBase} in sekai data`
                        );
                    }

                    [live2DModel, modelData] = await loadModel(
                        model,
                        layerIndex
                    );
                    break;
                }
                default:
                    throw new Error("Invalid model source");
            }

            updateModelState({
                character: currentSelectedCharacter,
                model: live2DModel,
                pose: 99999,
                expression: 99999,
                virtualEffect: false,
                modelName: modelBase,
                modelData: modelData,
            });
            setLoading(false);
            setParameterValues({});
            setSelectedParameter({ idx: -1, param: "_" });
        } catch {
            setLoadingMsg("Failed to load model!");
        } finally {
            if (characterSelect.current && modelSelect.current) {
                characterSelect.current.disabled = false;
                modelSelect.current.disabled = false;
            }
        }
    };

    const handleVirtualEffect = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.checked;

        if (value && currentModel?.model) {
            const crtFilter = new CRTFilter({
                time: 2,
                lineWidth: 10,
                lineContrast: 0.1,
                vignetting: 0,
            });
            const animateCRT = () => {
                crtFilter.time += 0.2;
                crtFilter.lineWidth = 10 + 5 * Math.sin(crtFilter.time * 0.01);
                crtFilter.seed = Math.random();
                requestAnimationFrame(animateCRT);
            };

            const adjustmentFilter = new AdjustmentFilter({
                alpha: 0.8,
                brightness: 1.2,
                blue: 1,
                green: 1,
                red: 0.7,
            });

            animateCRT();
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

    const handlePoseChange = async (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        if (currentModel?.model instanceof Live2DModel) {
            const pose = Number(event?.target.value);
            const selectedOption =
                event.target.options[event.target.selectedIndex].text;
            try {
                currentModel?.model.motion("Motion", pose);
                updateModelState({ pose });
            } catch {
                setLoadingMsg(`Fail to load ${selectedOption}!`);
                setLoading(true);
            }
        }
    };

    const handleExpressionChange = async (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        if (currentModel?.model instanceof Live2DModel) {
            const expression = Number(event?.target.value);
            const selectedOption =
                event.target.options[event.target.selectedIndex].text;
            try {
                currentModel?.model.motion("Expression", expression);
                updateModelState({ expression });
            } catch {
                setLoadingMsg(`Fail to load ${selectedOption}!`);
                setLoading(true);
            }
        }
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
        currentModel?.model.scale.set(scale, scale);
        updateModelState({ modelScale: scale });
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
        }
    };

    const handleLive2DParamsChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        params: string
    ) => {
        const newValue = Number(e.target.value);
        coreModel?.setParameterValueById(params, newValue);
        setParameterValues((prev) => ({
            ...prev,
            [params]: newValue,
        }));
    };

    const handleLive2DParamsStep = (type: string, params: string) => {
        let newValue: number = 0;
        const currentValue = coreModel?.getParameterValueById(params) ?? 0;
        const step = 1;
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
        setParameterValues((prev) => ({
            ...prev,
            [params]: newValue,
        }));
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

    const live2DInputSlider = (idx: number, param: string, filter?: string) => {
        if (filter && !param.includes(filter)) {
            return null;
        }

        if (idx == -1) return null;

        if (!coreModel || !currentModel) return null;

        const min = coreModel.getParameterMinimumValue(idx);
        const max = coreModel.getParameterMaximumValue(idx);
        const value = coreModel.getParameterValueById(param);

        return (
            <div className="option__content" key={param}>
                {filter && <h3>{t(`model.${param}`)}</h3>}
                <input
                    type="range"
                    name={param}
                    id={param}
                    min={min}
                    max={max}
                    step={0.01}
                    value={parameterValues[param] ?? value}
                    onChange={(e) => {
                        handleLive2DParamsChange(e, param);
                    }}
                />
            </div>
        );
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
                    {openTab !== "select-layer" && (
                        <i className="bi bi-caret-down-fill" />
                    )}
                </div>
                {openTab === "select-layer" && (
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
                            />
                            <button
                                className="btn-circle btn-white"
                                onClick={handleDeleteLayer}
                            >
                                <i className="bi bi-x-circle"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {(currentModel?.model instanceof Live2DModel ||
                currentModel?.character == "none") && (
                <>
                    <div
                        className="option"
                        onClick={() => setOpenTab("character")}
                    >
                        <div className="space-between flex-horizontal center">
                            <h2>{t("model.character")}</h2>
                            {openTab !== "character" && (
                                <i className="bi bi-caret-down-fill" />
                            )}
                        </div>
                        {openTab === "character" && (
                            <div className="option__content">
                                <select
                                    value={currentSelectedCharacter}
                                    onChange={handleCharacterChange}
                                    ref={characterSelect}
                                >
                                    <option value="none" disabled>
                                        {t("model.select-character")}
                                    </option>
                                    {Object.keys(
                                        currentModel.from === "static"
                                            ? staticCharacterData
                                            : sekaiCharacterData
                                    ).map((character) => (
                                        <option
                                            key={character}
                                            value={character}
                                        >
                                            {t(`character.${character}`)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                    <div
                        className="option"
                        onClick={() => setOpenTab("costume")}
                    >
                        <div className="space-between flex-horizontal center">
                            <h2>{t("model.costume")}</h2>
                            {openTab !== "costume" && (
                                <i className="bi bi-caret-down-fill" />
                            )}
                        </div>

                        {openTab === "costume" && (
                            <div className="option__content">
                                <select
                                    value={currentModel?.modelName}
                                    onChange={handleCostumeChange}
                                    ref={modelSelect}
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
                                    label="Virtual Effect"
                                    checked={currentModel.virtualEffect}
                                    onChange={handleVirtualEffect}
                                />
                            </div>
                        )}
                    </div>

                    {loading && <div className="option">{loadingMsg}</div>}
                    <div
                        className="option"
                        onClick={() => {
                            setOpenTab("emotion");
                        }}
                    >
                        <div className="space-between flex-horizontal center">
                            <h2>{t("model.emotion")}</h2>
                            {openTab !== "emotion" && (
                                <i className="bi bi-caret-down-fill" />
                            )}
                        </div>
                        {openTab === "emotion" && (
                            <>
                                <div className="option__content">
                                    <h3>{t("model.pose")}</h3>
                                    <select
                                        value={currentModel?.pose}
                                        onChange={handlePoseChange}
                                    >
                                        <option value={99999} disabled>
                                            {t("model.select-pose")}
                                        </option>
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
                                    <select
                                        value={currentModel?.expression}
                                        onChange={handleExpressionChange}
                                    >
                                        <option value={99999} disabled>
                                            {t("model.select-expression")}
                                        </option>
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
                    {openTab !== "transform" && (
                        <i className="bi bi-caret-down-fill" />
                    )}
                </div>
                {openTab === "transform" && (
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
                                min={-720}
                                max={1720}
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
                                name="x-value"
                                id="x-value"
                                min={-1280}
                                max={1280}
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
                                name="x-value"
                                id="x-value"
                                min={0}
                                max={1}
                                step={0.01}
                                value={currentModel?.modelScale}
                                onChange={handleScaleTransform}
                            />
                        </div>
                        <div className="option__content">
                            <Checkbox
                                id="visible"
                                label={t("visible")}
                                checked={currentModel?.visible}
                                onChange={handleVisible}
                            />
                        </div>
                    </>
                )}
            </div>

            {currentModel?.model instanceof Live2DModel && !loading && (
                <>
                    <div
                        className="option"
                        onClick={() => {
                            setOpenTab("mouth");
                        }}
                    >
                        <div className="space-between flex-horizontal center">
                            <h2>{t("model.mouth")}</h2>
                            {openTab !== "mouth" && (
                                <i className="bi bi-caret-down-fill" />
                            )}
                        </div>
                        {openTab === "mouth" && (
                            <div className="option__content">
                                {coreModel &&
                                    coreModel["_parameterIds"]
                                        .map((param: string, idx: number) => {
                                            return live2DInputSlider(
                                                idx,
                                                param,
                                                "Mouth"
                                            );
                                        })
                                        .filter(Boolean)}
                            </div>
                        )}
                    </div>
                    <div
                        className="option"
                        onClick={() => {
                            setOpenTab("advanced");
                        }}
                    >
                        <div className="space-between flex-horizontal center">
                            <h2>{t("model.advanced")}</h2>
                            {openTab !== "advanced" && (
                                <i className="bi bi-caret-down-fill" />
                            )}
                        </div>
                        {openTab === "advanced" && (
                            <div className="option__content">
                                <h3>Live2D Parameters</h3>
                                {coreModel && (
                                    <>
                                        <select
                                            name="parameters"
                                            id="parameters"
                                            onChange={(e) => {
                                                const [param, idx] =
                                                    e.target.value.split(",");
                                                console.log(param, idx);
                                                setSelectedParameter({
                                                    idx: Number(idx),
                                                    param,
                                                });
                                            }}
                                            value={`${selectedParameter?.param},${selectedParameter?.idx}`}
                                        >
                                            <option value="_,-1" disabled>
                                                Select a parameter
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
                                        {selectedParameter && (
                                            <>
                                                {live2DInputSlider(
                                                    selectedParameter?.idx,
                                                    selectedParameter?.param
                                                )}
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
                                    <h3>Toggles</h3>
                                    <Checkbox
                                        label="Idle Animation"
                                        checked={currentModel.idle}
                                        id="idle"
                                        onChange={handleIdle}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ModelSidebar;
