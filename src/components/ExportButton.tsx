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
import Window from "./Window";

const ExportButton: React.FC = () => {
    const [loadingMsg, setLoadingMsg] = useState<string>("");
    const context = useContext(SceneContext);

    const { t } = useTranslation();

    const [show, setShow] = useState<boolean>(false);
    if (!context) throw new Error("Context not prepared.");

    const {
        background,
        splitBackground,
        text,
        models,
        modelContainer,
        reset,
        sceneJson,
        setBackground,
        setSplitBackground,
        setText,
        setModels,
        setLayers,
        setNextLayer,
        setReset,
        setSceneJson,
    } = context;
    const jsonRef = useRef<IJsonSave | undefined>(sceneJson);

    useEffect(() => {
        if (
            background === undefined ||
            splitBackground === undefined ||
            text === undefined ||
            models === undefined
        )
            return;
        const modifiedDateStamp = new Date().toISOString();
        const currentBackground = !background?.upload
            ? background?.filename
            : "/img/Background_Between_Worlds.jpg";
        const currentSplitBackground = {
            first: splitBackground.first.filename,
            second: splitBackground.second.filename,
        };
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

        setSceneJson({
            lastModified: modifiedDateStamp,
            background: currentBackground,
            splitBackground: currentSplitBackground,
            text: currentText,
            models: currentModels,
        });
    }, [background, splitBackground, text, models]);

    useEffect(() => {
        jsonRef.current = sceneJson;
    }, [sceneJson]);
    useEffect(() => {
        const interval = setInterval(() => {
            localStorage.setItem("autoSave", JSON.stringify(jsonRef.current));
        }, 1000 * 60 * 3);

        return () => clearInterval(interval);
    }, []);

    const loadScene = async (data: IJsonSave) => {
        setLoadingMsg("Fetching background...");
        const backgroundData = data.background;
        const backgroundSprite = await getBackground(backgroundData);
        const firstBackgroundData = data.splitBackground.first;
        const secondBackgroundData = data.splitBackground.second;
        const firstBackgroundSprite = await getBackground(firstBackgroundData);
        const secondBackgroundSprite = await getBackground(
            secondBackgroundData
        );

        if (
            !backgroundSprite ||
            !firstBackgroundSprite ||
            !secondBackgroundSprite
        ) {
            throw new Error(
                "Error from background. Could be that the background does not exist."
            );
        }


        setLoadingMsg("Fetching text...");
        const textNameTag = data.text.nameTag;
        const textDialogue = data.text.dialogue;

        const modelJson = data.models;

        if (modelJson.length <= 0)
            throw new Error("JSON should have at least one model.");

        let modelTextures: Record<string, IModel> = {};

        modelContainer?.removeChildren();
        for (const [idx, model] of modelJson.entries()) {
            let modelData: ILive2DModelData | undefined = undefined;
            setLoadingMsg(
                `(${idx + 1}/${modelJson.length}): ${t("loading-1")} ${
                    model.modelName
                }`
            );
            if (model.from === "static") {
                const [characterFolder] = await GetCharacterFolder(
                    model.modelName
                );

                modelData = await GetModelDataFromStatic(
                    characterFolder,
                    model.modelName
                );
            }
            if (model.from === "sekai") {
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
                `(${idx + 1}/${modelJson.length}): ${t("loading-4")} ${
                    model.modelName
                }`
            );
            await axios.get(
                modelData.url + modelData.FileReferences.Textures[0]
            );
            setLoadingMsg(
                `(${idx + 1}/${modelJson.length}): ${t("loading-5")} ${
                    model.modelName
                }`
            );
            await axios.get(modelData.url + modelData.FileReferences.Moc, {
                responseType: "arraybuffer",
            });
            setLoadingMsg(
                `(${idx + 1}/${modelJson.length}): ${t("loading-6")} ${
                    model.modelName
                }`
            );
            await axios.get(modelData.url + modelData.FileReferences.Physics);
            setLoadingMsg(
                `(${idx + 1}/${modelJson.length}): ${t("loading-7")} ${
                    model.modelName
                }`
            );
            const live2DModel = await Live2DModel.from(modelData, {
                autoInteract: false,
            });
            live2DModel.scale.set(model?.modelTransform.scale);
            live2DModel.anchor.set(0.5, 0.5);
            live2DModel.position.set(
                model?.modelTransform.x,
                model?.modelTransform.y
            );
            modelContainer?.addChildAt(live2DModel, idx);
            if (
                model?.modelExpression !== 99999 ||
                model?.modelExpression !== 99999
            ) {
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
                    virtualEffect: false,
                    expression: model.modelExpression,
                    pose: model.modelPose,
                    idle: true,
                    visible: true,
                    from: model.from,
                },
            };
        }

        background?.backgroundContainer.removeChildAt(0);
        background?.backgroundContainer.addChildAt(backgroundSprite, 0);
        if (background?.backgroundContainer) {
            setBackground({
                ...background,
                filename: backgroundData,
            });
        }

        splitBackground?.first.backgroundContainer.removeChildAt(0)
        splitBackground?.first.backgroundContainer.addChildAt(firstBackgroundSprite, 0)
        splitBackground?.second.backgroundContainer.removeChildAt(0)
        splitBackground?.second.backgroundContainer.addChildAt(secondBackgroundSprite, 0)
        if (splitBackground?.splitContainer) {
            setSplitBackground({
                ...splitBackground,
                first: {
                    ...splitBackground.first,
                    filename: firstBackgroundData
                },
                second: {
                    ...splitBackground.second,
                    filename: secondBackgroundData
                }
            })
        }

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

        setModels(modelTextures);
        setLayers(Object.keys(modelTextures).length);
        setNextLayer(Object.keys(modelTextures).length);
        setLoadingMsg("");
    };

    const handleExport = () => {
        const jsonString = JSON.stringify(sceneJson, null, 2);
        const blob = new Blob([jsonString], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "export.json";
        a.click();
        a.remove();
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
                            setSceneJson(data);
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
                <Window
                    id="export-screen"
                    show={setShow}
                    buttons={
                        <>
                            <button
                                className="btn-regular btn-blue center"
                                onClick={handleImport}
                                disabled={loadingMsg !== ""}
                            >
                                {t("import-export.import")}
                            </button>
                            <button
                                className="btn-regular btn-blue center"
                                onClick={handleExport}
                                disabled={loadingMsg !== ""}
                            >
                                {t("import-export.export")}
                            </button>
                        </>
                    }
                >
                    <div className="window__content">
                        <h1>{t("import-export.header")}</h1>
                        <p>{t("import-export.description")}</p>
                        {loadingMsg && <p>{loadingMsg}</p>}
                        <textarea
                            name="json"
                            id="json"
                            value={
                                sceneJson
                                    ? JSON.stringify(sceneJson, null, 2)
                                    : ""
                            }
                            readOnly
                        />
                    </div>
                </Window>
            )}
        </div>
    );
};

export default ExportButton;
