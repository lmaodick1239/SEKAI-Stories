import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAudioManager } from "../../utils/useAudioManager";

interface WindowProps {
    show: React.Dispatch<React.SetStateAction<boolean>>;
    confirmFunction?: (x: string) => void;
    confirmLabel?: string;
    className?: string;
}
const InputWindow: React.FC<WindowProps> = ({
    show,
    confirmFunction,
    confirmLabel = "OK",
    className = "",
}) => {
    const { playSound } = useAudioManager();
    const [data, setData] = useState<string>("");

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleClose();
            }
            if (e.key === "Enter" && confirmFunction) {
                confirmFunction(data);
                handleClose();
            }
        };
        document.addEventListener("keydown", handleKey);
        const main = document.querySelector("body");
        if (main) {
            main.style.overflow = "hidden";
        }
        return () => {
            if (main) {
                main.style.overflow = "";
            }
            document.removeEventListener("keydown", handleKey);
        };
    }, [data]);
    
    useEffect(() => {
        playSound("/sound/open.wav");

    }, [])

    const window = useRef<HTMLDivElement | null>(null);
    const { t } = useTranslation();

    const handleClose = () => {
        playSound("/sound/close.wav");
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
            className={`screen ${className}`}
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            <div
                className="window"
                ref={window}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="window__content">
                    <h1 className="text-center">Input</h1>
                    <p className="text-center">
                        Enter a nice name for this emotion.
                    </p>
                    <p className="text-center">(Leave blank to remove)</p>
                    <input
                        type="text"
                        value={data}
                        onChange={(e) => {
                            const input = e.target.value;
                            setData(input);
                        }}
                        autoFocus
                    />
                </div>
                <div className="window__buttons">
                    {confirmFunction && (
                        <button
                            className="btn-regular btn-blue center"
                            onClick={() => {
                                confirmFunction(data);
                                handleClose();
                            }}
                        >
                            {confirmLabel}
                        </button>
                    )}
                    <button
                        className="btn-regular btn-white center close-button"
                        onClick={() => handleClose()}
                    >
                        {t("close")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InputWindow;
