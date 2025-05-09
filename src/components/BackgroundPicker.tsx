import { fuzzy } from "fast-fuzzy";
import React, {
    ChangeEvent,
    useCallback,
    useContext,
    useDeferredValue,
    useEffect,
    useMemo,
    useState,
} from "react";
import { SceneContext } from "../contexts/SceneContext";
import data from "../background.json";
import { getBackground } from "../utils/GetBackground";
import { useTranslation } from "react-i18next";

const BackgroundPicker: React.FC = () => {
    const { t } = useTranslation();

    const [show, setShow] = useState<boolean>(false);

    const context = useContext(SceneContext);

    if (!context) throw new Error("Context not found");

    const { background, setBackground } = context;

    const [searchValue, setSearchValue] = useState("");
    const handleSearchValueChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setSearchValue(e.target.value);
        },
        []
    );
    const deferredSearchValue = useDeferredValue(searchValue);
    const filteredBackgrounds = useMemo(() => {
        if (!deferredSearchValue) {
            return data.background;
        }
        return data.background.filter((bg) => {
            return (
                fuzzy(deferredSearchValue, bg.replace(/[^a-z0-9]/gi, "")) > 0.5
            );
        });
    }, [deferredSearchValue]);

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

    useEffect(() => {
        const onKeyDown = (keyDownEvent: KeyboardEvent) => {
            if (keyDownEvent.key === "Escape") {
                if (searchValue) {
                    setSearchValue("");
                } else {
                    setShow(false);
                }
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [searchValue]);

    return (
        <>
            {show && (
                <div id="picker">
                    <button
                        id="picker-close"
                        className="btn-circle btn-pink"
                        onClick={() => {
                            setShow(false);
                        }}
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                    <input
                        type="text"
                        value={searchValue}
                        onChange={handleSearchValueChange}
                        placeholder="Search background"
                        style={{
                            position: "fixed",
                            top: 10,
                            width: "80%",
                            zIndex: 9999,
                        }}
                    />
                    {filteredBackgrounds.map((bg) => {
                        return (
                            <div
                                key={bg}
                                className="picker-div relative center"
                            >
                                <img
                                    className="picker-item background-picker-item"
                                    src={`/background_low_jpg/${bg}.jpg`}
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
                <button
                    className="btn-regular btn-extend-width btn-blue"
                    onClick={() => {
                        setShow(!show);
                    }}
                >
                    {t("select")}
                </button>
            </div>
        </>
    );
};

export default BackgroundPicker;
