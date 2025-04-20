import React, { useContext } from "react";
import BackgroundPicker from "../BackgroundPicker";
import { AppContext } from "../../contexts/AppContext";
import UploadImageButton from "../UploadButton";
import { getBackground } from "../../utils/GetBackground";

const BackgroundSidebar: React.FC = () => {
    const context = useContext(AppContext);

    if (
        !context ||
        !context.background ||
        !context.background.backgroundContainer
    )
        return "Please wait...";

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
            });
        }
    };

    return (
        <div>
            <h1>Background</h1>
            <div className="option">
                <div className="option__content">
                    <BackgroundPicker />
                    <UploadImageButton
                        id="background-upload"
                        uploadFunction={handleUploadImage}
                        text="Upload"
                        alertMsg="To make sure the image looks right and doesn't get stretched or cut downed, please use an image with a 16:9 ratio."
                    />
                </div>
            </div>
        </div>
    );
};

export default BackgroundSidebar;
