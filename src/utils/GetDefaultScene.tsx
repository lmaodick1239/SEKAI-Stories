import * as PIXI from "pixi.js";
import { getBackground } from "../utils/GetBackground";
import { Live2DModel } from "pixi-live2d-display";
import { Dispatch, SetStateAction } from "react";
import { Assets } from "@pixi/assets";
import IBackground from "../types/IBackground";
import { ISplitBackground } from "../types/ISplitBackground";
import IText from "../types/IText";
import ISceneText from "../types/ISceneText";
import IGuideline from "../types/IGuideline";
import IModel from "../types/IModel";

interface GetDefaultSceneProps {
    app: PIXI.Application | undefined;
    setStartingMessage: Dispatch<SetStateAction<string>>;
    setLoading: Dispatch<SetStateAction<number>>;
    scene?: string;
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

    if (scene === "blank") {
        return {
            background: "/background_compressed/bg00026.jpg",
            model: "01ichika_cloth001",
            text: "<insert text here>",
            nameTag: "<name>",
            character: "custom",
            modelX: 960,
            modelY: 550,
            pngName: "blank",
            sceneText: "<white>",
        };
    }

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
    container: PIXI.Container,
    childAt: number,
    fileName: string
): Promise<IBackground> => {
    const backgroundContainer = new PIXI.Container();
    const backgroundSprite = await getBackground(fileName);
    backgroundContainer.addChild(backgroundSprite);
    container.addChildAt(backgroundContainer, childAt);

    return {
        backgroundContainer: backgroundContainer,
        filename: fileName,
        upload: false,
    };
};

const LoadSplitBackground = async (
    container: PIXI.Container,
    childAt: number
): Promise<ISplitBackground> => {
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
    container.addChildAt(splitBackgroundContainer, childAt);
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
    container: PIXI.Container,
    childAt: number,
    file: string,
    character: string,
    model: string,
    x: number,
    y: number
): Promise<{
    model: Record<string, IModel>;
    modelContainer: PIXI.Container;
}> => {
    const modelContainer = new PIXI.Container();
    const texture = await PIXI.Texture.fromURL(`/img/${file}.png`);
    const sprite = new PIXI.Sprite(texture);
    modelContainer.addChildAt(sprite, 0);
    sprite.anchor.set(0.5, 0.5);
    sprite.position.set(x, y);

    container.addChildAt(modelContainer, childAt);
    return {
        model: {
            character1: {
                character: character,
                model: sprite,
                modelName: model,
                modelX: sprite.x,
                modelY: sprite.y,
                modelScale: sprite.scale.x,
                modelRotation: 0,
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
): Promise<IText> => {
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
        hideEverything: false,
    };
};

const LoadSceneText = async (
    app: PIXI.Application,
    childAt: number,
    scene: string
): Promise<ISceneText> => {
    const sceneTextContainer = new PIXI.Container();

    // Middle Texture
    const sceneTextMiddleTexture = await Assets.load(
        "/img/SceneText_Background.png"
    );
    const sceneTextMiddleSprite = new PIXI.Sprite(sceneTextMiddleTexture);
    const sceneTextMiddle = new PIXI.Text(scene, {
        fontFamily: "FOT-RodinNTLGPro-DB",
        fontSize: 44,
        fill: 0xffffff,
        align: "center",
    });
    sceneTextMiddle.anchor.set(0.5, 0.5);
    sceneTextMiddle.position.set(960, 540);

    const sceneTextMiddleContainer = new PIXI.Container();
    sceneTextMiddleContainer.addChildAt(sceneTextMiddleSprite, 0);
    sceneTextMiddleContainer.addChildAt(sceneTextMiddle, 1);

    // Top-left Texture
    const sceneTextTopLeftTexture = await Assets.load(
        "/img/SceneText_TopLeft.png"
    );
    const sceneTextTopLeftSprite = new PIXI.Sprite(sceneTextTopLeftTexture);
    const sceneTextTopLeft = new PIXI.Text(scene, {
        fontFamily: "FOT-RodinNTLGPro-DB",
        fontSize: 39,
        fill: 0xffffff,
        align: "center",
    });
    sceneTextTopLeft.anchor.set(0, 0.5);
    sceneTextTopLeft.position.set(120, 62);

    const sceneTextTopLeftContainer = new PIXI.Container();
    sceneTextTopLeftContainer.addChildAt(sceneTextTopLeftSprite, 0);
    sceneTextTopLeftContainer.addChildAt(sceneTextTopLeft, 1);
    sceneTextTopLeftContainer.visible = false;

    sceneTextContainer.addChildAt(sceneTextMiddleContainer, 0);
    sceneTextContainer.addChildAt(sceneTextTopLeftContainer, 1);

    app.stage.addChildAt(sceneTextContainer, childAt);

    sceneTextContainer.visible = false;

    return {
        sceneTextContainer: sceneTextContainer,
        middle: sceneTextMiddleContainer,
        topLeft: sceneTextTopLeftContainer,
        text: [sceneTextMiddle, sceneTextTopLeft],
        textString: scene,
        visible: false,
        variant: "middle",
    };
};

const LoadGuideline = async (
    app: PIXI.Application,
    childAt: number
): Promise<IGuideline> => {
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
    setLoading,
    scene,
}: GetDefaultSceneProps) => {
    setLoading(0);
    const initialScene: InitialScene = LoadInitialScene(scene);

    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    if (app) {
        app.stop();
    }

    setLoading(10);
    const initApplication = new PIXI.Application({
        view: canvas,
        autoStart: true,
        width: 1920,
        height: 1080,
        backgroundColor: 0x000000,
    });

    Live2DModel.registerTicker(PIXI.Ticker);

    setLoading(20);
    // Load Transparent (for development. idk why it causes issues before production)
    const transparentContainer = new PIXI.Container();
    const transparentSprite = await getBackground(
        "/background_special/Background_Transparent.png"
    );
    transparentContainer.addChildAt(transparentSprite, 0);
    initApplication.stage.addChildAt(transparentContainer, 0);

    setLoading(30);
    // Load Filter Container
    const filterContainer = new PIXI.Container();
    initApplication.stage.addChildAt(filterContainer, 1);
    const filter = { container: filterContainer, flashback: false };

    setLoading(40);
    // Load Background
    setStartingMessage("Adding background...");
    const background = await LoadBackground(
        filterContainer,
        0,
        initialScene["background"]
    );

    setLoading(50);
    // Load Split Background
    const splitBackground = await LoadSplitBackground(filterContainer, 1);

    setLoading(60);
    // Load Sample PNG Sprite
    const { model, modelContainer } = await LoadModel(
        filterContainer,
        2,
        initialScene.pngName,
        initialScene.character,
        initialScene.model,
        initialScene.modelX,
        initialScene.modelY
    );

    setLoading(70);
    // Load Text
    setStartingMessage("Adding text...");
    const text = await LoadText(
        initApplication,
        2,
        initialScene.nameTag,
        initialScene.text
    );

    setLoading(80);
    // Load Scene Setting Text
    const sceneText = await LoadSceneText(
        initApplication,
        3,
        initialScene.sceneText
    );

    setLoading(90);
    // Load Guideline Tools
    const guideline = await LoadGuideline(initApplication, 4);

    setLoading(100);
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
        filter: filter,
        guideline: guideline,
    };
};
