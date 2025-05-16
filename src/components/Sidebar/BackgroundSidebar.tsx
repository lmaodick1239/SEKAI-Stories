import React, { useContext } from "react";
import BackgroundPicker from "../BackgroundPicker";
import { SceneContext } from "../../contexts/SceneContext";
import UploadImageButton from "../UploadButton";
import { getBackground } from "../../utils/GetBackground";
import { useTranslation } from "react-i18next";

const BackgroundSidebar: React.FC = () => {
    const { t } = useTranslation();
    const context = useContext(SceneContext);

    if (
        !context ||
        !context.background ||
        !context.background.backgroundContainer
    )
        return t("please-wait");

    const { background, setBackground } = context;

    const handleUploadImage = async (file: File) => {
        const imgSrc = URL.createObjectURL(file);
        const backgroundImage = await getBackground(imgSrc);
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

    return (
        <div>
            <h1>{t("background.header")}</h1>
            <div className="option">
                <div className="option__content">
                    <BackgroundPicker />
                    <UploadImageButton
                        id="background-upload"
                        uploadFunction={handleUploadImage}
                        text={t("background.upload")}
                        alertMsg={t("background.upload-info")}
                    />
                </div>
            </div>
        </div>
    );
};

export default BackgroundSidebar;
