import * as PIXI from "pixi.js";
import { Assets } from "@pixi/assets";
import { Live2DModel } from "pixi-live2d-display";
import IAppContextType from "../types/IAppContextType";
import { getBackground } from "./GetBackground";

export const refreshCanvas = async (context: IAppContextType) => {
    if (!context?.app || !context.text || !context.background) return;

    const { app, setApp, text, background, modelContainer } = context;
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    app.stop();

    const initApplication = new PIXI.Application({
        view: canvas,
        autoStart: true,
        width: 1920,
        height: 1080,
        backgroundColor: 0x000000,
    });

    Live2DModel.registerTicker(PIXI.Ticker);
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
    transparentContainer.addChild(transparentSpriteForNameTag);
    transparentContainer.addChild(transparentSpriteForDialogue);
    transparentContainer.addChild(transparentSpriteForWhateverReason);
    initApplication.stage.addChildAt(transparentContainer, 0);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (background.backgroundContainer) {
        initApplication.stage.addChildAt(background.backgroundContainer, 1);
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (modelContainer) {
        initApplication.stage.addChildAt(modelContainer, 2);
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const textBackgroundTexture = await Assets.load(
        "/img/Dialogue_Background.png"
    );
    const textBackgroundSprite = new PIXI.Sprite(textBackgroundTexture);
    textBackgroundSprite.width = 1920;
    textBackgroundSprite.height = 1080;
    initApplication.stage.addChildAt(textBackgroundSprite, 3);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    initApplication.stage.addChildAt(text.nameTag, 4);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    initApplication.stage.addChildAt(text.dialogue, 5);
    await new Promise((resolve) => setTimeout(resolve, 2000));


    setApp(initApplication);
};
