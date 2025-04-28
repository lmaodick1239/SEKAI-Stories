import React from "react";
import { useTranslation } from "react-i18next";

interface AddModelSelectProps {
    addModel: (from: string) => void;
    setShow: (state: boolean) => void;
}

const AddModelSelect: React.FC<AddModelSelectProps> = ({
    addModel,
    setShow,
}) => {
    const { t } = useTranslation();

    return (
        <div
            id="add-model-select-screen"
            onClick={(e) => {
                e.stopPropagation();
                setShow(false);
            }}
        >
            <div
                className="window window-center"
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <button
                    className="btn-blue btn-regular btn-extend-width"
                    onClick={() => {
                        addModel("sekai");
                        setShow(false);
                    }}
                >
                    {t("add-model-sekai")}
                    <p>{t("add-model-sekai-description")}</p>
                </button>
                <button
                    className="btn-blue btn-regular btn-extend-width"
                    onClick={() => {
                        addModel("static");
                        setShow(false);
                    }}
                >
                    {t("add-model-static")}
                    <p>{t("add-model-static-description")}</p>
                </button>
                <button
                    className="btn-white btn-regular"
                    onClick={() => {
                        setShow(false);
                    }}
                >
                    {t("close")}
                </button>
            </div>
        </div>
    );
};

export default AddModelSelect;
