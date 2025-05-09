import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SceneContext } from "../contexts/SceneContext";
import { IJsonSave } from "../types/IJsonSave";
import { ValidateJsonSave } from "../utils/ValidateJsonSave";
import { getBackground } from "../utils/GetBackground";
import { GetCharacterFolder } from "../utils/GetCharacterFolder";
import {
    GetModelDataFromSekai,
    GetModelDataFromStatic,
} from "../utils/GetModelData";
import axios from "axios";
import { Live2DModel } from "pixi-live2d-display";
import IModel from "../types/IModel";
import { ILive2DModelData } from "../types/ILive2DModelData";
import { GetCharacterDataFromSekai } from "../utils/GetCharacterDataFromSekai";

const ExportButton: React.FC = () => {
    const [loadingMsg, setLoadingMsg] = useState<string>("");
    const context = useContext(SceneContext);

    const { t } = useTranslation();

    const [show, setShow] = useState<boolean>(false);
    if (!context) throw new Error("Context not prepared.");

    const {
        background,
        text,
        models,
        modelContainer,
        reset,
        setBackground,
        setText,
        setModels,
        setLayers,
        setNextLayer,
        setReset,
    } = context;
    const [json, setJson] = useState<IJsonSave | undefined>(undefined);
    const jsonRef = useRef<IJsonSave | undefined>(json);

    useEffect(() => {
        if (
            background === undefined ||
            text === undefined ||
            models === undefined
        )
            return;
        const modifiedDateStamp = new Date().toISOString();
        const currentBackground = !background?.upload
            ? background?.filename
            : "/background_compressed/Background_Between_Worlds.jpg";
        const currentText = {
            nameTag: text?.nameTagString,
            dialogue: text?.dialogueString,
        };
        const currentModels = Object.values(models)
            .map((model) => {
                if (model.from === "upload") return undefined;
                if (model.character === "none") return undefined;
                return {
                    from: model.from,
                    character: model.character,
                    modelName: model.modelName,
                    modelTransform: {
                        x: model.modelX,
                        y: model.modelY,
                        scale: model.modelScale,
                    },
                    modelExpression: model.expression,
                    modelPose: model.pose,
                };
            })
            .filter((model) => model !== undefined);

        setJson({
            lastModified: modifiedDateStamp,
            background: currentBackground,
            text: currentText,
            models: currentModels,
        });
    }, [background, text, models]);

    useEffect(() => {
        jsonRef.current = json;
    }, [json]);
    useEffect(() => {
        const interval = setInterval(() => {
            localStorage.setItem("autoSave", JSON.stringify(jsonRef.current));
        }, 1000 * 60 * 3); 

        return () => clearInterval(interval);
    }, []);

    const loadScene = async (data: IJsonSave) => {
        const backgroundData = data.background;
        const backgroundSprite = await getBackground(backgroundData);

        if (!backgroundSprite)
            throw new Error(
                "Error from background. Could be that the background does not exist."
            );
        setLoadingMsg("Fetching background...");

        const textNameTag = data.text.nameTag;
        const textDialogue = data.text.dialogue;
        setLoadingMsg("Fetching text...");

        const modelJson = data.models;

        if (modelJson.length <= 0)
            throw new Error("JSON should have at least one model.");

        let modelTextures: Record<string, IModel> = {};

        modelContainer?.removeChildren();
        for (const [idx, model] of modelJson.entries()) {
            let modelData: ILive2DModelData | undefined = undefined;
            if (model.from === "static") {
                setLoadingMsg(
                    `Loading model ${idx + 1} of ${
                        modelJson.length
                    }: Fetching ${model.modelName} model3`
                );
                const [characterFolder] = await GetCharacterFolder(
                    model.modelName
                );

                modelData = await GetModelDataFromStatic(
                    characterFolder,
                    model.modelName
                );
            }
            if (model.from === "sekai") {
                setLoadingMsg(
                    `Loading model ${idx + 1} of ${
                        modelJson.length
                    }: Fetching ${model.modelName} model3`
                );
                const characterData = await GetCharacterDataFromSekai(
                    model.character,
                    model.modelName
                );
                modelData = await GetModelDataFromSekai(characterData);
            }

            if (!modelData) {
                throw new Error(`Model data not found for ${model.modelName}.`);
            }

            setLoadingMsg(
                `Loading model ${idx + 1} of ${modelJson.length}: Loading ${
                    model.modelName
                } textures`
            );
            await axios.get(
                modelData.url + modelData.FileReferences.Textures[0]
            );
            setLoadingMsg(
                `Loading model ${idx + 1} of ${modelJson.length}: Loading ${
                    model.modelName
                } moc data`
            );
            await axios.get(modelData.url + modelData.FileReferences.Moc, {
                responseType: "arraybuffer",
            });
            setLoadingMsg(
                `Loading model ${idx + 1} of ${modelJson.length}: Loading ${
                    model.modelName
                } physics data`
            );
            await axios.get(modelData.url + modelData.FileReferences.Physics);
            setLoadingMsg(
                `Loading model ${idx + 1} of ${modelJson.length}: Adding ${
                    model.modelName
                } to scene`
            );
            const live2DModel = await Live2DModel.from(modelData, {
                autoInteract: false,
            });
            live2DModel.scale.set(model?.modelTransform.scale);
            live2DModel.position.set(
                model?.modelTransform.x,
                model?.modelTransform.y
            );
            modelContainer?.addChildAt(live2DModel, idx);
            if (
                model?.modelExpression !== 99999 ||
                model?.modelExpression !== 99999
            ) {
                setLoadingMsg(
                    `Loading model ${idx + 1} of ${
                        modelJson.length
                    }: Adding emotion and pose to ${model.modelName}`
                );
                live2DModel.motion("Expression", model.modelExpression);
                await new Promise((resolve) => setTimeout(resolve, 2000));
                live2DModel.motion("Motion", model.modelPose);
            }
            modelTextures = {
                ...modelTextures,
                [`character${idx + 1}`]: {
                    character: model.character,
                    model: live2DModel,
                    modelName: model.modelName,
                    modelX: live2DModel.x,
                    modelY: live2DModel.y,
                    modelScale: live2DModel.scale.x,
                    modelData: modelData,
                    expression: model.modelExpression,
                    pose: model.modelPose,
                    visible: true,
                    from: model.from,
                },
            };
        }

        setLoadingMsg("Setting background...");
        background?.backgroundContainer.removeChildAt(0);
        background?.backgroundContainer.addChildAt(backgroundSprite, 0);
        if (background?.backgroundContainer) {
            setBackground({
                ...background,
                filename: backgroundData,
            });
        }

        setLoadingMsg("Setting text...");
        if (text && text.nameTag && text.dialogue) {
            text.nameTag.text = textNameTag;
            text.nameTag.updateText(true);
            text.dialogue.text = textDialogue;
            text.dialogue.updateText(true);
            setText({
                ...text,
                nameTagString: textNameTag,
                dialogueString: textDialogue,
            });
        }

        setLoadingMsg("Setting models...");
        setModels(modelTextures);
        setLayers(Object.keys(modelTextures).length);
        setNextLayer(Object.keys(modelTextures).length);
        setLoadingMsg("");
    };

    const handleExport = () => {
        const jsonString = JSON.stringify(json, null, 2);
        const blob = new Blob([jsonString], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "export.json";
        a.click();
        a.remove();
        alert("Exported JSON file");
    };

    const handleImport = async () => {
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
                    const data = JSON.parse(jsonString);
                    if (ValidateJsonSave(data)) {
                        try {
                            await loadScene(data);
                            setJson(data);
                        } catch (error) {
                            alert(
                                "Error loading scene: " +
                                    error +
                                    "\nResetting canvas."
                            );
                            console.error("Error loading scene:", error);
                            setReset(reset + 1);
                            setLoadingMsg("");
                        }
                    } else {
                        alert("Invalid JSON file format.");
                        throw new Error("Invalid valid JSON");
                    }
                }
            };
            reader.readAsText(file);
        };
        input.click();
        input.remove();
    };

    return (
        <div id="export-button">
            <button
                className="btn-circle btn-white"
                onClick={() => setShow(true)}
            >
                <i className="bi bi-braces sidebar__select"></i>
            </button>
            {show && (
                <div
                    id="export-screen"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShow(false);
                    }}
                >
                    <div
                        className="window"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="window__content">
                            <h1>Import/Export</h1>
                            <p>
                                Custom backgrounds and models are not included
                                in this JSON file.
                            </p>
                            {loadingMsg && <p>{loadingMsg}</p>}
                            <textarea
                                name="json"
                                id="json"
                                value={
                                    json ? JSON.stringify(json, null, 2) : ""
                                }
                                readOnly
                            />
                        </div>
                        <div className="window__buttons">
                            <button
                                className="btn-regular btn-blue center"
                                onClick={handleImport}
                                disabled={loadingMsg !== ""}
                            >
                                Import
                            </button>
                            <button
                                className="btn-regular btn-blue center"
                                onClick={handleExport}
                                disabled={loadingMsg !== ""}
                            >
                                Export
                            </button>
                            <button
                                className="btn-regular btn-white center"
                                onClick={() => setShow(false)}
                            >
                                {t("close")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExportButton;
