import { ILive2DModelData } from "../types/ILive2DModelData";
import { ILive2DModelList } from "../types/ILive2DModelList";
import { IMotionsExpressions } from "../types/IMotionExpression";
import { sekaiUrl, staticUrl } from "./URL";

export const GetModelDataFromStatic = async (
    characterFolder: string,
    modelName: string,
    modelData: ILive2DModelData,
    motionData: IMotionsExpressions
): Promise<ILive2DModelData> => {
    modelData.url = `${staticUrl}/model/${characterFolder}/${modelName}/`;

    const motions = [];
    for (const elem of motionData.motions) {
        motions.push({
            Name: elem,
            File: `${staticUrl}/motion/${characterFolder}/${elem}.motion3.json`,
            FadeInTime: 1,
            FadeOutTime: 1,
        });
    }
    const expressions = [];
    for (const elem of motionData.expressions) {
        expressions.push({
            Name: elem,
            File: `${staticUrl}/motion/${characterFolder}/${elem}.motion3.json`,
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

export const GetModelDataFromSekai = async (
    modelList: ILive2DModelList,
    modelData: ILive2DModelData,
    motionData: IMotionsExpressions,
    motionBaseName: string
): Promise<ILive2DModelData> => {
    modelData.url = `${sekaiUrl}/model/${modelList.modelPath}/`;

    const motions = [];
    for (const elem of motionData.motions) {
        motions.push({
            Name: elem,
            File: `${sekaiUrl}/motion/${motionBaseName}/motion/${elem}.motion3.json`,
            FadeInTime: 1,
            FadeOutTime: 1,
        });
    }
    const expressions = [];
    for (const elem of motionData.expressions) {
        expressions.push({
            Name: elem,
            File: `${sekaiUrl}/motion/${motionBaseName}/facial/${elem}.motion3.json`,
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
