import React, { useContext, useEffect, useRef } from "react";
import { SoftErrorContext } from "../../contexts/SoftErrorContext";
import { useAudioManager } from "../../hooks/useAudioManager";

interface SoftErrorProps {
    message?: string;
}

const SoftError: React.FC<SoftErrorProps> = () => {
    const { playSound } = useAudioManager();

    const softError = useContext(SoftErrorContext);

    if (!softError) throw new Error("Context not found");

    const { errorInformation, setErrorInformation, setShowErrorInformation } =
        softError;

    useEffect(() => {
        playSound("/sound/open.wav");
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

    const handleClose = () => {
        playSound("/sound/close.wav");
        if (window.current) {
            window.current.style.transition = "opacity 0.1s linear";
            window.current.style.opacity = "0";
            setTimeout(() => {
                setErrorInformation("");
                setShowErrorInformation(false);
                if (window.current) {
                    window.current.style.transition = "";
                    window.current.style.transform = "";
                }
            }, 200);
        } else {
            setErrorInformation("");
            setShowErrorInformation(false);
        }
    };

    return (
        <div
            className="middle-information-div"
            ref={window}
            onClick={(e) => {
                e.stopPropagation();
                handleClose();
            }}
        >
            <div className="middle-information">
                {/* <h3>Error</h3> */}
                {errorInformation.split("\n").map((line, idx) => (
                    <p key={idx}>{line}</p>
                ))}
            </div>
        </div>
    );
};

export default SoftError;
