import React, { useContext } from "react";
import { AppContext } from "../contexts/AppContext";
import * as PIXI from "pixi.js";
import { refreshCanvas } from "../utils/RefreshCanvas";

const DownloadClearButtons: React.FC = () => {
    const context = useContext(AppContext);

    if (!context) {
        return;
    }

    const { app } = context;

    const handleSave = () => {
        // const region = app?.stage.getBounds();
        const region = new PIXI.Rectangle(0, 0, 1920, 1080);
        const texture = app?.renderer.generateTexture(app.stage, { region });
        const dataURL = app?.renderer.plugins.extract.image(texture).src;

        var a = document.createElement("a");
        a.href = dataURL;
        a.download = "canvas.png";
        document.body.append(a);
        a.click();
        a.remove();

        refreshCanvas(context);
    };

    return (
        <div className="absolute bottom-left flex-vertical">
            <button className="btn-regular btn-blue" onClick={handleSave}>
                Save
            </button>
            <button className="btn-regular btn-white">Clear</button>
        </div>
    );
};

export default DownloadClearButtons;
