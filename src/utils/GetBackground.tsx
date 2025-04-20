import * as PIXI from "pixi.js";

export const getBackground = async (file: string): Promise<PIXI.Sprite> => {
    const backgroundTexture = await PIXI.Texture.fromURL(file);
    const backgroundSprite = new PIXI.Sprite(backgroundTexture);
    const imageWidth = backgroundTexture.width;
    const imageHeight = backgroundTexture.height;
    const scale = Math.max(1920 / imageWidth, 1080 / imageHeight);
    backgroundSprite.scale.set(scale);
    backgroundSprite.x = (1920 - imageWidth * scale) / 2;
    backgroundSprite.y = (1080 - imageHeight * scale) / 2;
    
    return backgroundSprite;
};
