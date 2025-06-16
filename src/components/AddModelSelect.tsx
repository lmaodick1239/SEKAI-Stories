import React, { SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import Window from "./UI/Window";

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
            <div className="window__content">
                <h1>{t("model.add-model-header")}</h1>
                <p>{t("model.add-model-description")}</p>
                <button
                    className="btn-blue btn-regular btn-extend-width"
                    onClick={() => {
                        addModel("sekai");
                        setShow(false);
                    }}
                >
                    sekai.best
                    <p>{t("model.add-model-sekai-description")}</p>
                </button>
                <button
                    className="btn-blue btn-regular btn-extend-width"
                    onClick={() => {
                        addModel("static");
                        setShow(false);
                    }}
                >
                    SEKAI Stories
                    <p>{t("model.add-model-static-description")}</p>
                </button>
            </div>
        </Window>
    );
};

export default AddModelSelect;
