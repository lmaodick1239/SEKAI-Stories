import React, { useContext } from "react";
import { getBackground } from "../../../../utils/GetBackground";
import BackgroundPicker from "../../../BackgroundPicker";
import UploadImageButton from "../../../UI/UploadButton";
import { Checkbox } from "../../../UI/Checkbox";
import { SceneContext } from "../../../../contexts/SceneContext";
import { useTranslation } from "react-i18next";

const Select: React.FC = () => {
    const { t } = useTranslation();
    const scene = useContext(SceneContext);
    if (!scene) throw new Error("Context not found");

    const { background, setBackground, splitBackground, setSplitBackground } =
        scene;
    if (!background || !background.backgroundContainer) return t("please-wait");
    const handleUploadImage = async (file: File) => {
        const imgSrc = URL.createObjectURL(file);
        const backgroundImage = await getBackground(imgSrc).catch();
        background.backgroundContainer.removeChildAt(0);
        background.backgroundContainer.addChildAt(backgroundImage, 0);
        if (background?.backgroundContainer) {
            setBackground({
                ...background,
                filename: imgSrc,
                upload: true,
            });
        }
    };

    const handleSplitImage = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.checked;

        if (splitBackground?.splitContainer) {
            splitBackground.splitContainer.visible = value;
            setSplitBackground({
                ...splitBackground,
                visible: value,
            });
        }
    };

    return (
        <>
            {splitBackground?.visible ? (
                <>
                    <BackgroundPicker
                        background={splitBackground.first}
                        setFunction={(bg) => {
                            setSplitBackground({
                                ...splitBackground,
                                first: {
                                    ...splitBackground.first,
                                    filename: bg,
                                },
                            });
                        }}
                    />
                    <BackgroundPicker
                        background={splitBackground.second}
                        setFunction={(bg) => {
                            setSplitBackground({
                                ...splitBackground,
                                second: {
                                    ...splitBackground.second,
                                    filename: bg,
                                },
                            });
                        }}
                    />
                </>
            ) : (
                <>
                    <BackgroundPicker
                        background={background}
                        setFunction={(bg) => {
                            setBackground({
                                ...background,
                                filename: bg,
                            });
                        }}
                    />
                    <UploadImageButton
                        id="background-upload"
                        uploadFunction={handleUploadImage}
                        text={t("background.upload")}
                        alertMsg={t("background.upload-info")}
                    />
                </>
            )}
            <Checkbox
                id="split"
                label={t("background.split-location")}
                checked={splitBackground?.visible}
                onChange={handleSplitImage}
            />
        </>
    );
};

export default Select;
