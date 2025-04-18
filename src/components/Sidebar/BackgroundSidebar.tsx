import React, { useContext } from "react";
import BackgroundPicker from "../BackgroundPicker";
import { AppContext } from "../../contexts/AppContext";

const BackgroundSidebar: React.FC = () => {
    const context = useContext(AppContext);

    if (
        !context ||
        !context.background ||
        !context.background.backgroundContainer
    )
        return "Please wait...";

    return (
        <div>
            <h1>Background</h1>
            <div className="option">
                <div className="option__content">
                    <BackgroundPicker />
                </div>
            </div>
        </div>
    );
};

export default BackgroundSidebar;
