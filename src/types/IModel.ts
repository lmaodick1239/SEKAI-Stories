import { InternalModel, Live2DModel } from "pixi-live2d-display";

export default interface IModel {
    character: string;
    file: string;
    model: Live2DModel<InternalModel>;
    modelX: number;
    modelY: number;
    modelScale: number;
    expression: number | undefined;
    pose: number | undefined;
}
