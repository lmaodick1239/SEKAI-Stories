import React, { useState } from "react";
import { AppContext } from "./AppContext";
import * as PIXI from "pixi.js";
import { Assets } from "@pixi/assets";
import { Live2DModel } from "pixi-live2d-display";
import { useEffect } from "react";
import IModel from "../types/IModel";
import IBackground from "../types/IBackground";
import IText from "../types/IText";
import axios from "axios";
import GetMotionList from "../utils/GetMotionList";
import { getBackground } from "../utils/GetBackground";

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
    const [hide, setHide] = useState<boolean>(false)

    useEffect(() => {
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
                "/background_special/Background_Uranohoshi.png"
            );
            backgroundContainer.addChild(backgroundSprite);
            initApplication.stage.addChildAt(backgroundContainer, 1);

            // Load Sample Model
            const modelContainer = new PIXI.Container();

            const getmodel = await axios.get(
                "/models/07airi_normal/07airi_normal.model3.json"
            );

            const data = GetMotionList("07airi_normal", getmodel.data);

            const live2DModel = await Live2DModel.from(data, {
                autoInteract: false,
            });
            live2DModel.scale.set(0.5);
            live2DModel.position.set(190, -280);

            modelContainer.addChildAt(live2DModel, 0);
            initApplication.stage.addChildAt(modelContainer, 2);
            live2DModel.motion("Expression", 38);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            live2DModel.motion("Pose", 102);

            // Load Text
            const textContainer = new PIXI.Container();
            const textBackgroundTexture = await Assets.load(
                "/img/Dialogue_Background.png"
            );
            const textBackgroundSprite = new PIXI.Sprite(textBackgroundTexture);
            textBackgroundSprite.width = 1920;
            textBackgroundSprite.height = 1080;

            const textNameTag = new PIXI.Text("Airi", {
                fontFamily: "FOT-RodinNTLGPro-EB",
                fontSize: 44,
                fill: 0xebebef,
                stroke: 0x5d5d79,
                strokeThickness: 8,
            });
            textNameTag.position.set(225, 780);

            const textDialogue = new PIXI.Text(
                "No, I will not do AiScream to you.",
                {
                    fontFamily: "FOT-RodinNTLGPro-DB",
                    fontSize: 44,
                    fill: 0xffffff,
                    stroke: 0x5d5d79,
                    strokeThickness: 8,
                    wordWrap: true,
                    wordWrapWidth: 1450,
                    breakWords: true,
                }
            );
            textDialogue.position.set(245, 845);

            initApplication.stage.addChildAt(textBackgroundSprite, 3);
            initApplication.stage.addChildAt(textNameTag, 4);
            initApplication.stage.addChildAt(textDialogue, 5);

            setApp(initApplication);
            setText({
                textContainer: textContainer,
                nameTag: textNameTag,
                dialogue: textDialogue,
                nameTagString: "Ichika",
                dialogueString: "Chicken Jockey.",
                fontSize: 44,
            });
            setModels({
                character1: {
                    character: "airi",
                    file: "07airi_normal",
                    model: live2DModel,
                    modelX: live2DModel.x,
                    modelY: live2DModel.y,
                    modelScale: live2DModel.scale.x,
                    expression: 38,
                    pose: 102,
                },
            });
            setModelContainer(modelContainer);
            setBackground({
                backgroundContainer: backgroundContainer,
                filename: "/background_special/Background_Uranohoshi.png",
            });
            setText({
                textContainer: textContainer,
                nameTag: textNameTag,
                dialogue: textDialogue,
                nameTagString: "Airi",
                dialogueString: "No, I will not do AiScream to you.",
                fontSize: 44,
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
                setHide
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
