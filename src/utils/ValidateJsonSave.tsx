import { IJsonSave } from "../types/IJsonSave";
import { ILive2DParameterJsonSave } from "../types/ILive2DParameterJsonSave";
export const ValidateJsonSave = (parsedJson: IJsonSave) => {
    return (
        typeof parsedJson.background === "string" &&
        typeof parsedJson.splitBackground === "object" &&
        typeof parsedJson.splitBackground.first === "string" &&
        typeof parsedJson.splitBackground.second === "string" &&
        typeof parsedJson.text === "object" &&
        typeof parsedJson.text.nameTag === "string" &&
        typeof parsedJson.text.dialogue === "string" &&
        Array.isArray(parsedJson.models) &&
        parsedJson.models.every(
            (model) =>
                model &&
                typeof model.from === "string" &&
                typeof model.character === "string" &&
                typeof model.modelName === "string" &&
                typeof model.modelParametersChanged === "object" &&
                Object.entries(model.modelParametersChanged).every(
                    ([name, value]) => {
                        return (
                            typeof name === "string" &&
                            typeof value === "number"
                        );
                    }
                ) &&
                typeof model.modelIdle === "boolean"
        )
    );
};

export const ValidateLive2DParameterJsonSave = (
    parsedJson: ILive2DParameterJsonSave
) => {
    return Object.entries(parsedJson).every(([name, value]) => {
        return typeof name === "string" && typeof value === "number";
    });
};
