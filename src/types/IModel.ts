import { InternalModel, Live2DModel } from "pixi-live2d-display-mulmotion";
import * as PIXI from "pixi.js";
import { ILive2DModelData } from "./ILive2DModelData";

export default interface IModel {
    character: string;
    model: Live2DModel<InternalModel> | PIXI.Sprite;
    modelName: string;
    modelX: number;
    modelY: number;
    modelScale: number;
    modelRotation: number;
    virtualEffect: boolean;
    modelData: ILive2DModelData | undefined;
    expression: number;
    pose: number;
    idle: boolean;
    visible: boolean;
    from: string;
    parametersChanged: Record<string, number>;
}
