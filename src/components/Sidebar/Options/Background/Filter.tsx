import React, { useContext } from "react";
import { Checkbox } from "../../../UI/Checkbox";
import { SceneContext } from "../../../../contexts/SceneContext";
import { AdjustmentFilter } from "pixi-filters";
import { sickEffect } from "../../../../utils/SickEffect";
import { getBackground } from "../../../../utils/GetBackground";
import * as PIXI from "pixi.js";
import { useTranslation } from "react-i18next";

const Filter: React.FC = () => {
    const scene = useContext(SceneContext);
    const { t } = useTranslation();

    if (!scene) throw new Error("Context not found");

    const { app, filter, setFilter } = scene;

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
        </div>
    );
};

export default Filter;
