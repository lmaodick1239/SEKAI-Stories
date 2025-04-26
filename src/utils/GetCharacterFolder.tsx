export const GetCharacterFolder = async (
    modelName: string
): Promise<[string, string]> => {
    const parts = modelName.split("_");
    if (parts.length > 2 && parts[0] === "v2") {
        return [parts[1], `${parts[0]}_${parts[1]}`];
    } else if (parts.length === 2) {
        return [parts[0], parts[0]];
    }
    throw new Error("Invalid model name format");
};
