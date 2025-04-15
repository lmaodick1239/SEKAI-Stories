import React from "react";
import BackgroundPicker from "../BackgroundPicker";

const BackgroundSidebar: React.FC = () => {
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
