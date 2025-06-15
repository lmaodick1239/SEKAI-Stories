import React, { useEffect, useRef } from "react";
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
        new Audio("/sound/open.wav").play();
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleClose();
            }
        };
        document.addEventListener("keydown", handleEsc);
        const main = document.querySelector("body");
        if (main) {
            main.style.overflow = "hidden";
        }
        return () => {
            if (main) {
                main.style.overflow = "";
            }
            document.removeEventListener("keydown", handleEsc);
        };
    }, []);

    const window = useRef<HTMLDivElement | null>(null);
    const { t } = useTranslation();

    const handleClose = () => {
        new Audio("/sound/close.wav").play();
        if (window.current) {
            window.current.style.transition = "transform 0.05s linear";
            window.current.style.transform = "scale(0.5)";
            setTimeout(() => {
                show(false);
                if (window.current) {
                    window.current.style.transition = "";
                    window.current.style.transform = "";
                }
            }, 100);
        } else {
            show(false);
        }
    };

    return (
        <div
            className="screen"
            id={id ?? id}
            onClick={(e) => {
                e.stopPropagation();
                handleClose();
            }}
        >
            <div
                className="window"
                ref={window}
                onClick={(e) => e.stopPropagation()}
            >
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
                                handleClose();
                            }}
                        >
                            {confirmLabel}
                        </button>
                    )}
                    <button
                        className="btn-regular btn-white center"
                        onClick={() => handleClose()}
                    >
                        {t("close")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Window;
