import React, { SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import Window from "./Window";

interface AddModelSelectProps {
    addModel: (from: string) => void;
    setShow: React.Dispatch<SetStateAction<boolean>>;
}

const AddModelSelect: React.FC<AddModelSelectProps> = ({
    addModel,
    setShow,
}) => {
    const { t } = useTranslation();

    return (
        <Window show={setShow}>
            <button
                className="btn-blue btn-regular btn-extend-width"
                onClick={() => {
                    addModel("sekai");
                    setShow(false);
                }}
            >
                {t("model.add-model-sekai")}
                <p>{t("model.add-model-sekai-description")}</p>
            </button>
            <button
                className="btn-blue btn-regular btn-extend-width"
                onClick={() => {
                    addModel("static");
                    setShow(false);
                }}
            >
                {t("model.add-model-static")}
                <p>{t("model.add-model-static-description")}</p>
            </button>
        </Window>
    );
};

export default AddModelSelect;
