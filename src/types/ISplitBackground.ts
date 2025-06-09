import IBackground from "./IBackground";
import * as PIXI from "pixi.js";

export interface ISplitBackground {
    splitContainer: PIXI.Container;
    first: IBackground;
    second: IBackground;
}
