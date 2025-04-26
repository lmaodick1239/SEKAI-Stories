import { ILive2DModelData } from "../types/ILive2DModelData";
import { IMotionsExpressions } from "../types/IMotionExpression";
import { url } from "./URL";

export const GetModelData = async (
    characterFolder: string,
    modelName: string,
    modelData: ILive2DModelData,
    motionData: IMotionsExpressions
): Promise<ILive2DModelData> => {
    modelData.url = `${url}/model/${characterFolder}/${modelName}/`;

    const motions = [];
    for (const elem of motionData.motions) {
        motions.push({
            Name: elem,
            File: `${url}/motion/${characterFolder}/${elem}.motion3.json`,
            FadeInTime: 1,
            FadeOutTime: 1,
        });
    }
    const expressions = [];
    for (const elem of motionData.expressions) {
        expressions.push({
            Name: elem,
            File: `${url}/motion/${characterFolder}/${elem}.motion3.json`,
            FadeInTime: 1,
            FadeOutTime: 1,
        });
    }

    modelData.FileReferences.Motions = {
        Motion: motions,
        Expression: expressions,
    };
    modelData.FileReferences.Expressions = {};
    return modelData;
};
