import React, { useContext, useState } from "react";
import { AppContext } from "../contexts/AppContext";
import data from "../background.json";
import { getBackground } from "../utils/GetBackground";

const BackgroundPicker: React.FC = () => {
    const [show, setShow] = useState<boolean>(false);

    const context = useContext(AppContext);

    if (!context) return;

    const { background, setBackground } = context;

    const handleChangeBackground = async (bg: string) => {
        const backgroundSprite = await getBackground(
            `/background_compressed/${bg}.jpg`
        );

        background?.backgroundContainer.removeChildAt(0);
        background?.backgroundContainer.addChildAt(backgroundSprite, 0);
        if (background?.backgroundContainer) {
            setBackground({
                ...background,
                filename: `/background_compressed/${bg}.jpg`,
            });
        }
    };

    return (
        <>
            {show && (
                <div
                    id="picker"
                    onClick={() => {
                        setShow(false);
                    }}
                >
                    <button id="picker-close" className="btn-circle btn-pink">
                        <i className="bi bi-x-lg"></i>
                    </button>
                    {data["background"].map((bg) => {
                        return (
                            <div
                                key={bg}
                                className="picker-div relative center"
                            >
                                <img
                                    className="picker-item background-picker-item"
                                    src={`/background_low/${bg}.png`}
                                    onClick={async () => {
                                        handleChangeBackground(bg);
                                        setShow(false);
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            )}
            <div>
                <img
                    src={background?.filename}
                    alt="background-selected"
                    id="background-picker"
                    onClick={() => {
                        setShow(!show);
                    }}
                />
            </div>
        </>
    );
};

export default BackgroundPicker;
