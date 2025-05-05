import characterData from "../character_sekai.json";
import { ILive2DModelList } from "../types/ILive2DModelList";

interface SekaiCharacterData {
    [character: string]: ILive2DModelList[];
}

const typedSekaiCharacterData: SekaiCharacterData = characterData;

export const GetCharacterDataFromSekai = async (
    character: string,
    modelBase: string
): Promise<ILive2DModelList> => {
    const characterData = typedSekaiCharacterData[character];
    if (!characterData) {
        throw new Error(`Character data for ${character} not found`);
    }

    const modelList = characterData.find(
        (model) => model.modelBase === modelBase
    );

    if (!modelList) {
        throw new Error(
            `No models found for ${character} with base ${modelBase}`
        );
    }
    return modelList;
};
