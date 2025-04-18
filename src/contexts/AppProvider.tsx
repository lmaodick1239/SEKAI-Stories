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
    const [models, setModels] = useState<Record<string, IModel>>({});
    const [layers, setLayers] = useState<number>(2);
    const [modelContainer, setModelContainer] = useState<
        PIXI.Container | undefined
    >(undefined);
    const [background, setBackground] = useState<IBackground | undefined>(
        undefined
    );
    const [text, setText] = useState<IText | undefined>(undefined);

    useEffect(() => {
        const runCanvas = async () => {
            const canvas = document.getElementById(
                "canvas"
            ) as HTMLCanvasElement;

            const initApplication = new PIXI.Application({
                view: canvas,
                autoStart: true,
                width: 1920,
                height: 1080,
                backgroundColor: 0x000000,
            });

            // await Assets.load({src: "/font/FOT-RodinNTLGPro-DB.ttf", data: { family: "FOT-RodinNTLGPro-DB" }})

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
                "/background/Background_School_SEKAI_Rooftop.png"
            );
            backgroundContainer.addChild(backgroundSprite);
            initApplication.stage.addChildAt(backgroundContainer, 1);

            // Load Sample Model
            const modelContainer = new PIXI.Container();

            const getmodel1 = await axios.get(
                "/models/01ichika_cloth001/01ichika_cloth001.model3.json"
            );

            const data1 = GetMotionList("01ichika_cloth001", getmodel1.data);

            const live2DModel1 = await Live2DModel.from(data1, {
                autoInteract: false,
            });
            live2DModel1.scale.set(0.3);

            const getmodel2 = await axios.get(
                "/models/02saki_jc/02saki_jc.model3.json"
            );

            const data2 = GetMotionList("02saki_jc", getmodel2.data);

            const live2DModel2 = await Live2DModel.from(data2, {
                autoInteract: false,
            });
            live2DModel2.scale.set(0.3);
            live2DModel2.position.set(300, 300)

            modelContainer.addChildAt(live2DModel1, 0);
            modelContainer.addChildAt(live2DModel2, 1);
            initApplication.stage.addChildAt(modelContainer, 2);
            live2DModel1.motion("Expression", 42);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            live2DModel1.motion("Pose", 47);

            // Load Text
            const textContainer = new PIXI.Container();
            const textBackgroundTexture = await Assets.load(
                "/img/Dialogue_Background.png"
            );
            const textBackgroundSprite = new PIXI.Sprite(textBackgroundTexture);
            textBackgroundSprite.width = 1920;
            textBackgroundSprite.height = 1080;

            const textNameTag = new PIXI.Text("Ichika", {
                fontFamily: "FOT-RodinNTLGPro-EB",
                fontSize: 44,
                fill: 0xebebef,
                stroke: 0x5d5d79,
                strokeThickness: 8,
            });
            textNameTag.position.set(225, 780);

            const textDialogue = new PIXI.Text("Chicken Jockey.", {
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
                    character: "ichika",
                    file: "01ichika_cloth001",
                    model: live2DModel1,
                    modelX: live2DModel1.x,
                    modelY: live2DModel1.y,
                    modelScale: live2DModel1.scale.x,
                    expression: 42,
                    pose: 47,
                },
                character2: {
                    character: "saki",
                    file: "02saki_jc",
                    model: live2DModel2,
                    modelX: live2DModel2.x,
                    modelY: live2DModel2.y,
                    modelScale: live2DModel2.scale.x,
                    expression: 99999,
                    pose: 99999,
                },
            });
            setModelContainer(modelContainer);
            setBackground({
                backgroundContainer: backgroundContainer,
                filename:
                    "/background/Background_School_SEKAI_Rooftop.png"
            });
            setText({
                textContainer: textContainer,
                nameTag: textNameTag,
                dialogue: textDialogue,
                nameTagString: "Ichika",
                dialogueString: "Chicken Jockey.",
                fontSize: 44,
            });
        };
        runCanvas();
    }, []);

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
                modelContainer,
                setModelContainer,
                background,
                setBackground,
                text,
                setText,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
