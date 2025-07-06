import React, { useContext, useState } from "react";
import BackgroundPicker from "../BackgroundPicker";
import { SceneContext } from "../../contexts/SceneContext";
import UploadImageButton from "../UI/UploadButton";
import { getBackground } from "../../utils/GetBackground";
import { useTranslation } from "react-i18next";
import { Checkbox } from "../UI/Checkbox";
import { AdjustmentFilter } from "pixi-filters";
import { SettingsContext } from "../../contexts/SettingsContext";

const BackgroundSidebar: React.FC = () => {
    const { t } = useTranslation();
    const scene = useContext(SceneContext);
    const settings = useContext(SettingsContext);
    const [openTab, setOpenTab] = useState<string>("select");

    if (!scene || !settings) throw new Error("Context not found");

    const {
        background,
        setBackground,
        splitBackground,
        setSplitBackground,
        filter,
        setFilter,
    } = scene;

    const { openAll } = settings;

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

    const handleFlashback = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!filter?.container) return;

        const value = event.target.checked;

        if (value) {
            const adjustmentFilter = new AdjustmentFilter({
                saturation: 0.5,
            });
            filter.container.filters = [adjustmentFilter];
        } else {
            filter.container.filters = [];
        }

        setFilter({
            ...filter,
            flashback: value,
        });
    };

    return (
        <div>
            <h1>{t("background.header")}</h1>
            <div
                className="option"
                onClick={() => {
                    setOpenTab("select");
                }}
            >
                <div className="space-between flex-horizontal center">
                    <h2>{t("background.select")}</h2>
                    {openAll || openTab === "select" ? (
                        <i className="bi bi-caret-down-fill" />
                    ) : (
                        <i className="bi bi-caret-right-fill" />
                    )}
                </div>
                {(openAll || openTab === "select") && (
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
                    </div>
                )}
            </div>
            <div
                className="option"
                onClick={() => {
                    setOpenTab("filters");
                }}
            >
                <div className="space-between flex-horizontal center">
                    <h2>{t("background.filters")}</h2>
                    {openAll || openTab === "filters" ? (
                        <i className="bi bi-caret-down-fill" />
                    ) : (
                        <i className="bi bi-caret-right-fill" />
                    )}
                </div>
                {(openAll || openTab === "filters") && (
                    <div className="option__content">
                        <Checkbox
                            id="flashback"
                            label={t("background.flashback")}
                            checked={filter?.flashback}
                            onChange={handleFlashback}
                        />
                        <p>More filters to come...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BackgroundSidebar;
