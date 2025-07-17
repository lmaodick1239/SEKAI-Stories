import React, { useContext, useState } from "react";
import { SceneContext } from "../../contexts/SceneContext";
import { useTranslation } from "react-i18next";
import SidebarOption from "../UI/SidebarOption";
import Select from "./Options/Background/Select";
import Filter from "./Options/Background/Filter";

const BackgroundSidebar: React.FC = () => {
    const { t } = useTranslation();
    const scene = useContext(SceneContext);
    const [openTab, setOpenTab] = useState<string>("select");

    if (!scene) throw new Error("Context not found");

    const { background } = scene;

    if (!background || !background.backgroundContainer) return t("please-wait");

    return (
        <div>
            <h1>{t("background.header")}</h1>
            <SidebarOption
                header={t("background.select")}
                option={openTab}
                setOption={setOpenTab}
                optionName="select"
            >
                <Select />
            </SidebarOption>
            <SidebarOption
                header={t("background.filters")}
                option={openTab}
                setOption={setOpenTab}
                optionName="filters"
            >
                <Filter />
            </SidebarOption>
        </div>
    );
};

export default BackgroundSidebar;
