export interface IExpressionPoseList {
    Name: string;
}

export interface IMotionList {
    Expression: Array<IExpressionPoseList>;
    Pose: Array<IExpressionPoseList>;
}

export interface IData {
    FileReferences: Record<"Motions", IMotionList>;
    url: string;
}

const GetMotionList = (filename: string, data: IData) => {
    const poseMotions = [];
    const expressions = [];
    for (const [key, value] of Object.entries(data.FileReferences.Motions)) {
        const addedValue = [...value];
        addedValue[0].Name = key;
        if (
            key.startsWith("w-") ||
            key.startsWith("m-") ||
            key.startsWith("l-") ||
            key.startsWith("n-")
        ) {
            poseMotions.push(...addedValue);
        }
        if (key.startsWith("face_")) {
            expressions.push(...addedValue);
        }
    }
    data.FileReferences.Motions = {
        Pose: poseMotions,
        Expression: expressions,
    };

    data.url = `/models/${filename}/`;
    return data;
};

export default GetMotionList;
