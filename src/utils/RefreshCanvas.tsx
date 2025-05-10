import * as PIXI from "pixi.js";
import { Live2DModel } from "pixi-live2d-display";
import ISceneContextType from "../types/IAppContextType";
import { getBackground } from "./GetBackground";

export const refreshCanvas = async (context: ISceneContextType) => {
    if (
        !context?.app ||
        !context.text ||
        !context.background ||
        !context.sceneSetting
    )
        return;

    const { app, setApp, text, background, modelContainer, sceneSetting } =
        context;
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
        "/background_special/Background_Transparent.png"
    );
    const transparentSpriteForDialogue = await getBackground(
        "/background_special/Background_Transparent.png"
    );
    const transparentSpriteForWhateverReason = await getBackground(
        "/background_special/Background_Transparent.png"
    );
    transparentContainer.addChild(transparentSpriteForNameTag);
    transparentContainer.addChild(transparentSpriteForDialogue);
    transparentContainer.addChild(transparentSpriteForWhateverReason);
    initApplication.stage.addChildAt(transparentContainer, 0);
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (background.backgroundContainer) {
        initApplication.stage.addChildAt(background.backgroundContainer, 1);
    }
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (modelContainer) {
        initApplication.stage.addChildAt(modelContainer, 2);
    }
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (text.textContainer) {
        initApplication.stage.addChildAt(text.textContainer, 3);
    }

    if (sceneSetting.sceneSettingContainer) {
        initApplication.stage.addChildAt(sceneSetting.sceneSettingContainer, 4);
    }

    setApp(initApplication);
};
