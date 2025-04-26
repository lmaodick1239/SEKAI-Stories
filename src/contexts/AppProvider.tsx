import React, { useState } from "react";
import { AppContext } from "./AppContext";
import * as PIXI from "pixi.js";
import { Assets } from "@pixi/assets";
import { Live2DModel } from "pixi-live2d-display";
import { useEffect } from "react";
import IModel from "../types/IModel";
import IBackground from "../types/IBackground";
import IText from "../types/IText";
import { getBackground } from "../utils/GetBackground";
import axios from "axios";
import { GetModelData } from "../utils/GetModelData";
import { url } from "../utils/URL";
// import axios from "axios";
// import GetMotionList from "../utils/GetMotionList";
// import axios from "axios";
// import { url } from "../utils/URL";
// import { GetModelData } from "../utils/GetModelData";
// import { GetMotionData } from "../utils/GetMotionUrl";

interface AppProviderProps {
    children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [openedSidebar, setOpenedSidebar] = useState<string>("text");
    const [app, setApp] = useState<PIXI.Application | undefined>(undefined);
    const [models, setModels] = useState<Record<string, IModel> | undefined>(
        undefined
    );
    const [layers, setLayers] = useState<number>(1);
    const [nextLayer, setNextLayer] = useState<number>(1);
    const [modelContainer, setModelContainer] = useState<
        PIXI.Container | undefined
    >(undefined);
    const [background, setBackground] = useState<IBackground | undefined>(
        undefined
    );
    const [text, setText] = useState<IText | undefined>(undefined);
    const [reset, setReset] = useState<number>(0);
    const [hide, setHide] = useState<boolean>(false);
    const [hideAnnouncements, setHideAnnouncements] = useState<boolean>(false);

    const initialScene = {
        background: "/background_special/Background_Uranohoshi.jpg",
        model: "07airi_normal",
        text: "No, I will not do AiScream on you.",
        nameTag: "Airi",
        character: "airi",
    };

    useEffect(() => {
        const cookie = localStorage.getItem("importantAnnouncement2");
        if (Number(cookie) >= 20) {
            setHideAnnouncements(true);
        }

        const runCanvas = async () => {
            const canvas = document.getElementById(
                "canvas"
            ) as HTMLCanvasElement;

            if (app) {
                app?.stop();
            }

            const initApplication = new PIXI.Application({
                view: canvas,
                autoStart: true,
                width: 1920,
                height: 1080,
                backgroundColor: 0x000000,
            });

            Live2DModel.registerTicker(PIXI.Ticker);

            // Load Transparent
            const transparentContainer = new PIXI.Container();
            const transparentSpriteForNameTag = await getBackground(
                "/background/Background_Transparent.png"
            );
            const transparentSpriteForDialogue = await getBackground(
                "/background/Background_Transparent.png"
            );
            const transparentSpriteForWhateverReason = await getBackground(
                "/background/Background_Transparent.png"
            );
            transparentContainer.addChildAt(transparentSpriteForNameTag, 0);
            transparentContainer.addChildAt(transparentSpriteForDialogue, 1);
            transparentContainer.addChildAt(
                transparentSpriteForWhateverReason,
                2
            );
            initApplication.stage.addChildAt(transparentContainer, 0);

            // Load Background
            const backgroundContainer = new PIXI.Container();
            const backgroundSprite = await getBackground(
                initialScene["background"]
            );
            backgroundContainer.addChild(backgroundSprite);
            initApplication.stage.addChildAt(backgroundContainer, 1);

            const modelContainer = new PIXI.Container();

            // Load Sample Model
            const characterFolder = initialScene["model"].split("_")[0];

            const model = await axios.get(
                `${url}/model/${characterFolder}/${initialScene["model"]}/${initialScene["model"]}.model3.json`
            );
            console.log(model.data)
            const motion = await axios.get(
                `${url}/motion/${characterFolder}/BuildMotionData.json`
            );
            console.log(motion.data);

            const modelData = await GetModelData(
                characterFolder,
                initialScene["model"],
                model.data,
                motion.data
            );

            await axios.get(
                modelData.url + modelData.FileReferences.Textures[0]
            );
            await axios.get(modelData.url + modelData.FileReferences.Moc);
            await axios.get(modelData.url + modelData.FileReferences.Physics);

            const live2DModel = await Live2DModel.from(modelData, {
                autoInteract: false,
            });
            live2DModel.scale.set(0.5);
            live2DModel.position.set(190, -280);

            modelContainer.addChildAt(live2DModel, 0);
            initApplication.stage.addChildAt(modelContainer, 2);
            live2DModel.motion("Expression", 38);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            live2DModel.motion("Motion", 102);

            // Load Sample PNG Sprite
            // const texture = await PIXI.Texture.fromURL("/img/airi.png");
            // const sprite = new PIXI.Sprite(texture);
            // modelContainer.addChildAt(sprite, 0);
            // sprite.position.set(620, 170);

            // initApplication.stage.addChildAt(modelContainer, 2);

            // Load Text
            const textContainer = new PIXI.Container();
            const textBackgroundTexture = await Assets.load(
                "/img/Dialogue_Background.png"
            );
            const textBackgroundSprite = new PIXI.Sprite(textBackgroundTexture);
            textBackgroundSprite.width = 1920;
            textBackgroundSprite.height = 1080;

            const textNameTag = new PIXI.Text(initialScene["nameTag"], {
                fontFamily: "FOT-RodinNTLGPro-EB",
                fontSize: 44,
                fill: 0xebebef,
                stroke: 0x5d5d79,
                strokeThickness: 8,
            });
            textNameTag.position.set(225, 780);

            const textDialogue = new PIXI.Text(initialScene["text"], {
                fontFamily: "FOT-RodinNTLGPro-DB",
                fontSize: 44,
                fill: 0xffffff,
                stroke: 0x5d5d79,
                strokeThickness: 8,
                wordWrap: true,
                wordWrapWidth: 1450,
                breakWords: true,
            });
            textDialogue.position.set(245, 845);

            textContainer.addChildAt(textBackgroundSprite, 0);
            textContainer.addChildAt(textNameTag, 1);
            textContainer.addChildAt(textDialogue, 2);

            initApplication.stage.addChildAt(textContainer, 3);

            setApp(initApplication);
            setModels({
                character1: {
                    character: initialScene["character"],
                    model: live2DModel,
                    modelName: initialScene["model"],
                    modelX: live2DModel.x,
                    modelY: live2DModel.y,
                    modelScale: live2DModel.scale.x,
                    modelData: modelData,
                    expression: 38,
                    pose: 102,
                    visible: true,
                },
            });
            setModelContainer(modelContainer);
            setBackground({
                backgroundContainer: backgroundContainer,
                filename: initialScene["background"],
            });
            setText({
                textContainer: textContainer,
                nameTag: textNameTag,
                dialogue: textDialogue,
                nameTagString: initialScene["nameTag"],
                dialogueString: initialScene["text"],
                fontSize: 44,
                visible: true,
            });
        };
        runCanvas();
    }, [reset]);

    return (
        <AppContext.Provider
            value={{
                openedSidebar,
                setOpenedSidebar,
                app,
                setApp,
                models,
                setModels,
                layers,
                setLayers,
                nextLayer,
                setNextLayer,
                modelContainer,
                setModelContainer,
                background,
                setBackground,
                text,
                setText,
                reset,
                setReset,
                hide,
                setHide,
                hideAnnouncements,
                setHideAnnouncements,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
