import { InternalModel, Live2DModel } from "pixi-live2d-display";

export default interface IModel {
    character: string;
    file: "01ichika_cloth001";
    model: Live2DModel<InternalModel>;
    modelX: number;
    modelY: number;
    modelScale: number;
    expression: number;
    pose: number;
}
