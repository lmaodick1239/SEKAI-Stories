import * as PIXI from "pixi.js";

export default interface IText {
    textContainer: PIXI.Container;
    nameTag: PIXI.Text;
    dialogue: PIXI.Text;

    nameTagString: string;
    dialogueString: string;
    fontSize: number;
    visible: boolean;
}
