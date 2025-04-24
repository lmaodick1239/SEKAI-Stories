import { ILive2DModelData } from "../types/ILive2DModelData";
import { ILive2DModelList } from "../types/ILive2DModelList";
import { IMotionsExpressions } from "../types/IMotionExpression";
import { url } from "./URL";

export const GetModelData = async (
    modelList: ILive2DModelList,
    modelData: ILive2DModelData,
    motionData: IMotionsExpressions,
    motionBaseName: string
): Promise<ILive2DModelData> => {
    modelData.url = `${url}/model/${modelList.modelPath}/`;

    const motions = [];
    for (const elem of motionData.motions) {
        motions.push({
            Name: elem,
            File: `${url}/motion/${motionBaseName}/motion/${elem}.motion3.json`,
            FadeInTime: 1,
            FadeOutTime: 1,
        });
    }
    const expressions = [];
    for (const elem of motionData.expressions) {
        expressions.push({
            Name: elem,
            File: `${url}/motion/${motionBaseName}/facial/${elem}.motion3.json`,
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
