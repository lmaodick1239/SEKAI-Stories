import { InternalModel, Live2DModel } from "pixi-live2d-display";
import * as PIXI from "pixi.js";
import { ILive2DModelData } from "./ILive2DModelData";

export default interface IModel {
    character: string;
    model: Live2DModel<InternalModel> | PIXI.Sprite;
    modelName: string;
    modelX: number;
    modelY: number;
    modelScale: number;
    virtualEffect: boolean;
    modelData: ILive2DModelData | undefined;
    expression: number | undefined;
    pose: number | undefined;
    idle: boolean;
    visible: boolean;
    from: string;
}
