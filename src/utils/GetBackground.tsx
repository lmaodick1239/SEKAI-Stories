import * as PIXI from "pixi.js";

export const getBackground = async (file: string): Promise<PIXI.Sprite> => {
    try {
        const backgroundTexture = await PIXI.Texture.fromURL(file);
        const backgroundSprite = new PIXI.Sprite(backgroundTexture);
        backgroundSprite.anchor.set(0.5, 0.5);
        const imageWidth = backgroundTexture.width;
        const imageHeight = backgroundTexture.height;
        const scale = Math.max(1920 / imageWidth, 1080 / imageHeight);
        backgroundSprite.scale.set(scale);
        backgroundSprite.x = 1920 / 2;
        backgroundSprite.y = 1080 / 2;
        return backgroundSprite;
    } catch {
        throw new Error(`Failed to load background image: ${file}`);
    }
};
