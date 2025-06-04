import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface WindowProps {
    show: React.Dispatch<React.SetStateAction<boolean>>;
    confirmFunction?: () => void;
    confirmLabel?: string;
    danger?: boolean;
    id?: string;
    buttons?: React.ReactNode;
    children: React.ReactNode;
}
const Window: React.FC<WindowProps> = ({
    show,
    confirmFunction,
    confirmLabel = "OK",
    danger = false,
    id,
    buttons,
    children,
}) => {
    useEffect(() => {
        const main = document.querySelector("body");
        if (main) {
            main.style.overflow = "hidden";
        }
        return () => {
            if (main) {
                main.style.overflow = "";
            }
        };
    }, []);
    const { t } = useTranslation();

    return (
        <div
            className="screen"
            id={id ?? id}
            onClick={(e) => {
                e.stopPropagation();
                show(false);
            }}
        >
            <div className="window" onClick={(e) => e.stopPropagation()}>
                {children}
                <div className="window__buttons">
                    {buttons}
                    {confirmFunction && (
                        <button
                            className={`btn-regular ${
                                danger ? "btn-red" : "btn-blue"
                            } center`}
                            onClick={() => {
                                confirmFunction();
                                show(false);
                            }}
                        >
                            {confirmLabel}
                        </button>
                    )}
                    <button
                        className="btn-regular btn-white center"
                        onClick={() => show(false)}
                    >
                        {t("close")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Window;
