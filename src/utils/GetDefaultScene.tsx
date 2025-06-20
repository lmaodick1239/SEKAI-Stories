import * as PIXI from "pixi.js";
import { getBackground } from "../utils/GetBackground";
import { Live2DModel } from "pixi-live2d-display";
import { Dispatch, SetStateAction } from "react";
import { Assets } from "@pixi/assets";

interface GetDefaultSceneProps {
    app: PIXI.Application | undefined;
    setStartingMessage: Dispatch<SetStateAction<string>>;
}
interface InitialScene {
    background: string;
    model: string;
    text: string;
    nameTag: string;
    character: string;
    modelX: number;
    modelY: number;
    pngName: string;
    sceneText: string;
}

const randomInitialScene: InitialScene[] = [
    {
        background: "/background_special/Background_Uranohoshi_Rooftop.jpg",
        model: "07airi_qtnormal",
        text: "I'm ○○○-sama's little demon number four...\nM-Momoi Airi...",
        nameTag: "Airi",
        character: "airi",
        modelX: 960,
        modelY: 590,
        pngName: "airi_littledemon",
        sceneText: "Uranohoshi High School Rooftop",
    },
    {
        background: "/background_compressed/bg_a001101.jpg",
        model: "v2_19ena_casual",
        text: "Mizuki, that's not how you break a KitKat!",
        nameTag: "Ena",
        character: "ena",
        modelX: 960,
        modelY: 630,
        pngName: "ena",
        sceneText: "Diner",
    },
    {
        background: "/background_compressed/bg_e000102.jpg",
        model: "v2_17kanade_casual",
        text: "Hashiridashita...?",
        nameTag: "Kanade",
        character: "kanade",
        modelX: 960,
        modelY: 630,
        pngName: "kanade",
        sceneText: "Kanade's Room",
    },
    {
        background: "/background_special/Background_SELF_CONTROL.jpg",
        model: "v2_20mizuki_school_back02",
        text: "I feel like I've heard this song before...",
        nameTag: "Mizuki",
        character: "mizuki",
        modelX: 1265,
        modelY: 630,
        pngName: "mizuki",
        sceneText: "Shrine",
    },
    {
        background: "/background_compressed/bg_a001801.jpg",
        model: "04shiho_cloth01",
        text: "...",
        nameTag: "Shiho",
        character: "shiho",
        modelX: 960,
        modelY: 610,
        pngName: "shiho",
        sceneText: "Music Shop",
    },
];

const LoadInitialScene = (scene?: string): InitialScene => {
    const date = new Date();
    const month = date.getMonth() + 1;

    if (month == 10) {
        return {
            background: "/background_special/Background_Cheat_to_Happiness.jpg",
            model: "18mafuyu_cloth001",
            text: "→↓↑→→↓→→↑↑↓↓←→←→",
            nameTag: "Mafuyu",
            character: "mafuyu",
            modelX: 960,
            modelY: 545,
            pngName: "mafuyu",
            sceneText: "Mafuyu's Room",
        };
    }

    if (scene === "junes") {
        return {
            background: "/background_special/Background_Dojima.png",
            model: "14emu_cloth001",
            text: "Every day's great at your Junes!",
            nameTag: "Emu",
            character: "emu",
            modelX: 960,
            modelY: 660,
            pngName: "emu",
            sceneText: "Dojima Residence",
        };
    }

    return randomInitialScene[
        Math.floor(Math.random() * randomInitialScene.length)
    ];
};

const firstSplitBackgroundFilename = "/background_compressed/bg_e000303.jpg";
const secondSplitBackgroundFilename = "/background_compressed/bg_e000403.jpg";

const LoadBackground = async (
    app: PIXI.Application,
    childAt: number,
    fileName: string
) => {
    const backgroundContainer = new PIXI.Container();
    const backgroundSprite = await getBackground(fileName);
    backgroundContainer.addChild(backgroundSprite);
    app.stage.addChildAt(backgroundContainer, childAt);

    return {
        backgroundContainer: backgroundContainer,
        filename: fileName,
        upload: false,
    };
};

const LoadSplitBackground = async (app: PIXI.Application, childAt: number) => {
    const splitBackgroundContainer = new PIXI.Container();
    const firstBackground = new PIXI.Container();
    const firstBackgroundSprite = await getBackground(
        firstSplitBackgroundFilename
    );
    const firstMask = new PIXI.Graphics();
    firstMask.beginFill();
    firstMask.moveTo(0, 0);
    firstMask.lineTo(985, 0);
    firstMask.lineTo(905, 1080);
    firstMask.lineTo(0, 1080);
    firstMask.endFill();
    firstBackground.mask = firstMask;
    firstBackground.addChild(firstBackgroundSprite);
    const secondBackground = new PIXI.Container();
    const secondBackgroundSprite = await getBackground(
        secondSplitBackgroundFilename
    );
    const secondMask = new PIXI.Graphics();
    secondMask.beginFill();
    secondMask.moveTo(1920, 0);
    secondMask.lineTo(1005, 0);
    secondMask.lineTo(925, 1080);
    secondMask.lineTo(1920, 1080);
    secondMask.endFill();
    secondBackground.mask = secondMask;
    secondBackground.addChild(secondBackgroundSprite);
    const line = new PIXI.Graphics();
    line.beginFill(0xffffff);
    line.moveTo(985, 0);
    line.lineTo(1005, 0);
    line.lineTo(925, 1080);
    line.lineTo(905, 1080);
    line.endFill();
    splitBackgroundContainer.addChildAt(firstBackground, 0);
    splitBackgroundContainer.addChildAt(secondBackground, 1);
    splitBackgroundContainer.addChildAt(line, 2);
    app.stage.addChildAt(splitBackgroundContainer, childAt);
    splitBackgroundContainer.visible = false;

    return {
        splitContainer: splitBackgroundContainer,
        first: {
            backgroundContainer: firstBackground,
            filename: firstSplitBackgroundFilename,
            upload: false,
        },
        second: {
            backgroundContainer: secondBackground,
            filename: secondSplitBackgroundFilename,
            upload: false,
        },
        visible: false,
    };
};

const LoadModel = async (
    app: PIXI.Application,
    childAt: number,
    file: string,
    character: string,
    model: string,
    x: number,
    y: number
) => {
    const modelContainer = new PIXI.Container();
    const texture = await PIXI.Texture.fromURL(`/img/${file}.png`);
    const sprite = new PIXI.Sprite(texture);
    modelContainer.addChildAt(sprite, 0);
    sprite.anchor.set(0.5, 0.5);
    sprite.position.set(x, y);

    app.stage.addChildAt(modelContainer, childAt);
    return {
        model: {
            character1: {
                character: character,
                model: sprite,
                modelName: model,
                modelX: sprite.x,
                modelY: sprite.y,
                modelScale: sprite.scale.x,
                modelData: undefined,
                virtualEffect: false,
                expression: 0,
                pose: 0,
                idle: true,
                visible: true,
                from: "sekai",
                parametersChanged: {},
            },
        },
        modelContainer: modelContainer,
    };
};

const LoadText = async (
    app: PIXI.Application,
    childAt: number,
    nameTag: string,
    dialogue: string
) => {
    const textAlignmentCookie = Number(
        localStorage.getItem("textAlignment") ?? 0
    );

    const textContainer = new PIXI.Container();
    const textBackgroundTexture = await Assets.load(
        "/img/Dialogue_Background.png"
    );
    const textBackgroundSprite = new PIXI.Sprite(textBackgroundTexture);
    textBackgroundSprite.width = 1920;
    textBackgroundSprite.height = 1080;

    const textNameTag = new PIXI.Text(nameTag, {
        fontFamily: "FOT-RodinNTLGPro-EB",
        fontSize: 44,
        fill: 0xebebef,
        stroke: 0x5d5d79,
        strokeThickness: 8,
    });
    textNameTag.position.set(225, 780 + textAlignmentCookie);

    const textDialogue = new PIXI.Text(dialogue, {
        fontFamily: "FOT-RodinNTLGPro-DB",
        fontSize: 44,
        fill: 0xffffff,
        stroke: 0x5d5d79,
        strokeThickness: 8,
        wordWrap: true,
        wordWrapWidth: 1300,
        breakWords: true,
        lineHeight: 55,
    });
    textDialogue.position.set(245, 845 + textAlignmentCookie);

    textContainer.addChildAt(textBackgroundSprite, 0);
    textContainer.addChildAt(textNameTag, 1);
    textContainer.addChildAt(textDialogue, 2);

    app.stage.addChildAt(textContainer, childAt);

    return {
        textContainer: textContainer,
        nameTag: textNameTag,
        dialogue: textDialogue,
        nameTagString: nameTag,
        dialogueString: dialogue,
        fontSize: 44,
        visible: true,
        yOffset: textAlignmentCookie,
    };
};

const LoadSceneText = async (
    app: PIXI.Application,
    childAt: number,
    scene: string
) => {
    const sceneTextContainer = new PIXI.Container();
    const sceneTextBackgroundTexture = await Assets.load(
        "/img/SceneText_Background.png"
    );
    const sceneTextBackgroundSprite = new PIXI.Sprite(
        sceneTextBackgroundTexture
    );
    const sceneText = new PIXI.Text(scene, {
        fontFamily: "FOT-RodinNTLGPro-DB",
        fontSize: 44,
        fill: 0xffffff,
        align: "center",
    });
    sceneText.anchor.set(0.5, 0.5);
    sceneText.position.set(960, 540);

    sceneTextContainer.addChildAt(sceneTextBackgroundSprite, 0);
    sceneTextContainer.addChildAt(sceneText, 1);

    app.stage.addChildAt(sceneTextContainer, childAt);
    sceneTextContainer.visible = false;

    return {
        sceneTextContainer: sceneTextContainer,
        text: sceneText,
        textString: scene,
        visible: false,
    };
};

const LoadGuideline = async (app: PIXI.Application, childAt: number) => {
    const guidelineContainer = new PIXI.Container();
    const gridTexture = await Assets.load("/img/grid.png");
    const gridSprite = new PIXI.Sprite(gridTexture);
    guidelineContainer.addChild(gridSprite);
    guidelineContainer.visible = false;
    guidelineContainer.alpha = 0.2;
    app.stage.addChildAt(guidelineContainer, childAt);

    return {
        container: guidelineContainer,
        visible: false,
    };
};

export const LoadScene = async ({
    app,
    setStartingMessage,
}: GetDefaultSceneProps) => {
    const initialScene: InitialScene = LoadInitialScene();

    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    if (app) {
        app.stop();
    }

    const initApplication = new PIXI.Application({
        view: canvas,
        autoStart: true,
        width: 1920,
        height: 1080,
        backgroundColor: 0x000000,
    });

    Live2DModel.registerTicker(PIXI.Ticker);

    // Load Transparent (for development. idk why it causes issues before production)
    const transparentContainer = new PIXI.Container();
    const transparentSprite = await getBackground(
        "/background_special/Background_Transparent.png"
    );
    transparentContainer.addChildAt(transparentSprite, 0);
    initApplication.stage.addChildAt(transparentContainer, 0);

    // Load Background
    setStartingMessage("Adding background...");
    const background = await LoadBackground(
        initApplication,
        1,
        initialScene["background"]
    );

    // Load Split Background
    const splitBackground = await LoadSplitBackground(initApplication, 2);

    // Load Sample PNG Sprite
    const { model, modelContainer } = await LoadModel(
        initApplication,
        3,
        initialScene.pngName,
        initialScene.character,
        initialScene.model,
        initialScene.modelX,
        initialScene.modelY
    );

    // Load Text
    setStartingMessage("Adding text...");
    const text = await LoadText(
        initApplication,
        4,
        initialScene.nameTag,
        initialScene.text
    );

    // Load Scene Setting Text
    const sceneText = await LoadSceneText(
        initApplication,
        5,
        initialScene.sceneText
    );

    // Load Guideline Tools
    const guideline = await LoadGuideline(initApplication, 6);

    return {
        app: initApplication,
        model: model,
        currentKey: "character1",
        currentModel: model["character1"],
        modelContainer: modelContainer,
        background: background,
        splitBackground: splitBackground,
        text: text,
        sceneText: sceneText,
        guideline: guideline,
    };
};
