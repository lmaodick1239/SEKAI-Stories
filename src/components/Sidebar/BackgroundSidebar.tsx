import React, { useContext, useState } from "react";
import BackgroundPicker from "../BackgroundPicker";
import { SceneContext } from "../../contexts/SceneContext";
import UploadImageButton from "../UI/UploadButton";
import { getBackground } from "../../utils/GetBackground";
import { useTranslation } from "react-i18next";
import { Checkbox } from "../UI/Checkbox";
import { AdjustmentFilter } from "pixi-filters";
import { sickEffect } from "../../utils/SickEffect";
import * as PIXI from "pixi.js";
import SidebarOption from "../UI/SidebarOption";

const BackgroundSidebar: React.FC = () => {
    const { t } = useTranslation();
    const scene = useContext(SceneContext);
    const [openTab, setOpenTab] = useState<string>("select");

    if (!scene ) throw new Error("Context not found");

    const {
        app,
        background,
        setBackground,
        splitBackground,
        setSplitBackground,
        filter,
        setFilter,
    } = scene;


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

    const handleSick = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!filter?.container) return;

        const value = event.target.checked;

        if (value) {
            const sickContainer = await sickEffect(app, filter.container);
            filter.container.addChildAt(sickContainer, 3);

            setFilter({
                ...filter,
                sick: {
                    container: sickContainer,
                    show: true,
                },
            });
        } else {
            if (!filter.sick) return;
            const sickContainer = filter.sick.container;
            sickContainer?.destroy();
            setFilter({
                ...filter,
                sick: {
                    container: null,
                    show: false,
                },
            });
        }
    };

    const handleDroop = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!filter?.container) return;

        const value = event.target.checked;

        if (value) {
            const droopLines = await getBackground("/img/droop.png");
            const droopContainer = new PIXI.Container();

            droopContainer.addChildAt(droopLines, 0);

            filter.container.addChildAt(droopContainer, 3);

            setFilter({
                ...filter,
                droop: {
                    container: droopContainer,
                    show: true,
                },
            });
        } else {
            filter.droop?.container?.destroy();
            setFilter({
                ...filter,
                droop: {
                    container: null,
                    show: false,
                },
            });
        }
    };

    return (
        <div>
            <h1>{t("background.header")}</h1>
            <SidebarOption
                header={t("background.select")}
                option={openTab}
                setOption={setOpenTab}
                optionName="select"
            >
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
            </SidebarOption>
            <SidebarOption
                header={t("background.filters")}
                option={openTab}
                setOption={setOpenTab}
                optionName="filters"
            >
                <Checkbox
                    id="flashback"
                    label={t("background.flashback")}
                    checked={filter?.flashback}
                    onChange={handleFlashback}
                />
                <Checkbox
                    id="sick"
                    label={t("background.sick")}
                    checked={filter?.sick?.show}
                    onChange={handleSick}
                />
                <Checkbox
                    id="drooping-lines"
                    label={t("background.drooping-lines")}
                    checked={filter?.droop?.show}
                    onChange={handleDroop}
                />
            </SidebarOption>
        </div>
    );
};

export default BackgroundSidebar;
