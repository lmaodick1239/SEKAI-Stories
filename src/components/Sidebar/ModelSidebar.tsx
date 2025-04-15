import React, { useState } from "react";
import characterData from "../../character.json";
import axios from "axios";

interface CharacterData {
    [key: string]: string[];
}

const typedCharacterData: CharacterData = characterData;

interface ModelSidebarProps {
    message?: string;
}

const ModelSidebar: React.FC<ModelSidebarProps> = () => {
    const [selectedCharacter, setSelectedCharacter] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<string>("");

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
        console.log(json_file);
    };

    return (
        <>
            <h2>Select Character</h2>
            <select value={selectedCharacter} onChange={handleCharacterChange}>
                <option value="" disabled>
                    Select a character
                </option>
                {Object.keys(characterData).map((character) => (
                    <option key={character} value={character}>
                        {character}
                    </option>
                ))}
            </select>

            <select value={selectedFile} onChange={handleFileChange}>
                <option value="" disabled>
                    Select a file
                </option>
                {selectedCharacter &&
                    typedCharacterData[selectedCharacter]?.map(
                        (file: string) => (
                            <option key={file} value={file}>
                                {file}
                            </option>
                        )
                    )}
            </select>
        </>
    );
};

export default ModelSidebar;
