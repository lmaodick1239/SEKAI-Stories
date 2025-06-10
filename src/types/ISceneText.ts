import * as PIXI from "pixi.js";

export default interface ISceneText {
    sceneTextContainer: PIXI.Container;
    text: PIXI.Text;
    textString: string;
    visible: boolean;
}
