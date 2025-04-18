import React, { useContext, useEffect, useState } from "react";
import characterData from "../../character.json";
import axios from "axios";
import { AppContext } from "../../contexts/AppContext";
import IModel from "../../types/IModel";
import GetMotionList, {
    IData,
    IExpressionPoseList,
} from "../../utils/GetMotionList";

interface CharacterData {
    [key: string]: string[];
}

const typedCharacterData: CharacterData = characterData;

interface ModelSidebarProps {
    message?: string;
}

const ModelSidebar: React.FC<ModelSidebarProps> = () => {
    const [poseFile, setPoseFile] = useState<IData | undefined>(undefined);
    const [currentModel, setCurrentModel] = useState<IModel | undefined>(
        undefined
    );

    const context = useContext(AppContext);
    useEffect(() => {
        const getPoseFile = async (filename: string) => {
            const data = await (
                await axios.get(`/models/${filename}/${filename}.model3.json`)
            ).data;
            const poseFile = await GetMotionList(filename, data);
            setPoseFile(poseFile);
        };
        if (context?.models && Object.keys(context.models).length > 0) {
            const key = Object.keys(context?.models)[0];
            setCurrentModel(context?.models[key]);
            getPoseFile(context.models[key].file);
        }
    }, [context?.models]);

    if (!context || !context.models) {
        return "Please wait...";
    }
    console.log(poseFile);

    const { models, setModels, layers, setLayers } = context;

    console.log(currentModel);

    const handleCharacterChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedCharacter(event.target.value);
    };

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const fileName = event.target.value;
        setSelectedFile(fileName);
        const json_file = await (
            await axios.get(`/models/${fileName}/${fileName}.model3.json`)
        ).data;
    };

    return (
        <div>
            <h1>Model</h1>
            <div className="option">
                <h2>Layer</h2>
                <div className="option__content">
                    <select onChange={handleCharacterChange}>
                        {Object.keys(models).map((model, idx) => (
                            <option key={model} value={model}>
                                Layer {idx}: {models[model].character}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="option">
                <h2>Character</h2>
                <div className="option__content">
                    <select
                        value={currentModel?.character}
                        onChange={handleCharacterChange}
                    >
                        {Object.keys(characterData).map((character) => (
                            <option key={character} value={character}>
                                {character}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="option">
                <h2>Costume</h2>
                <div className="option__content">
                    <select
                        value={currentModel?.file}
                        onChange={handleFileChange}
                    >
                        {currentModel?.character &&
                            typedCharacterData[currentModel?.character]?.map(
                                (file: string) => (
                                    <option key={file} value={file}>
                                        {file}
                                    </option>
                                )
                            )}
                    </select>
                </div>
            </div>
            <div className="option">
                <h2>Emotion</h2>
                <div className="option__content">
                    <h3>Pose</h3>
                    <select value={currentModel?.pose}>
                        {poseFile &&
                            poseFile.FileReferences.Motions.Pose.map(
                                (o: IExpressionPoseList, idx) => (
                                    <option key={idx} value={idx}>
                                        {o.Name}
                                    </option>
                                )
                            )}
                    </select>
                </div>
                <div className="option__content">
                    <h3>Expression</h3>
                    <select value={currentModel?.expression}>
                        {poseFile &&
                            poseFile.FileReferences.Motions.Expression.map(
                                (o: IExpressionPoseList, idx) => (
                                    <option key={idx} value={idx}>
                                        {o.Name}
                                    </option>
                                )
                            )}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default ModelSidebar;
