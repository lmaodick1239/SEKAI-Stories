import React, { useContext, useEffect, useRef } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";

const Loading: React.FC = () => {
    const settings = useContext(SettingsContext);
    const icon = useRef<HTMLDivElement | null>(null);

    if (!settings) throw new Error("Context not found");

    const { loading } = settings;

    useEffect(() => {
        if (!icon.current) {
            return;
        }
        if (loading === 100) {
            icon.current.style.opacity = "0";
            icon.current.style.visibility = "hidden";
        } else {
            icon.current.style.opacity = "1";
            icon.current.style.visibility = "visible";
        }
    });

    return (
        <div className="fixed bottom-right padding-10" ref={icon}>
            <div
                style={{
                    backgroundImage: "url(/img/miku.svg)",
                }}
                className="loading-container"
            >
                <img
                    src="/img/miku-filled.svg"
                    className="loading-fill"
                    style={{
                        clipPath: `inset(${100 - loading}% 0 0 0)`,
                    }}
                />
            </div>
        </div>
    );
};

export default Loading;
