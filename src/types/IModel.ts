import { InternalModel, Live2DModel } from "pixi-live2d-display";
import * as PIXI from "pixi.js";

export default interface IModel {
    character: string;
    file: string;
    model: Live2DModel<InternalModel> | PIXI.Sprite;
    modelX: number;
    modelY: number;
    modelScale: number;
    expression: number | undefined;
    pose: number | undefined;
    visible: boolean;
}
