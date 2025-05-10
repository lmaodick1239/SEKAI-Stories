import * as PIXI from "pixi.js";

export default interface ISceneSetting {
    sceneSettingContainer: PIXI.Container;
    text: PIXI.Text;
    textString: string;
    visible: boolean;
}
