import React, { useContext } from "react";
import BackgroundPicker from "../BackgroundPicker";
import { SceneContext } from "../../contexts/SceneContext";
import UploadImageButton from "../UploadButton";
import { getBackground } from "../../utils/GetBackground";
import { useTranslation } from "react-i18next";
import { Checkbox } from "../Checkbox";

const BackgroundSidebar: React.FC = () => {
    const { t } = useTranslation();
    const context = useContext(SceneContext);

    if (
        !context ||
        !context.background ||
        !context.background.backgroundContainer
    )
        return t("please-wait");

    const { background, setBackground, splitBackground, setSplitBackground } =
        context;

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
        <div>
            <h1>{t("background.header")}</h1>
            <div className="option">
                <div className="option__content">
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
                                        filename: `/background_compressed/${bg}.jpg`,
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
                </div>
            </div>
        </div>
    );
};

export default BackgroundSidebar;
