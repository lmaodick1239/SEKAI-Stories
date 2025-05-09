export interface IJsonSave {
    background: string;
    text: {
        nameTag: string;
        dialogue: string;
    };
    models: {
        from: string;
        character: string;
        modelName: string;
        modelTransform: { x: number; y: number; scale: number };
        modelExpression: number | undefined;
        modelPose: number | undefined;
    }[];
}
