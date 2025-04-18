import React, { useContext } from "react";
import { AppContext } from "../contexts/AppContext";
import * as PIXI from "pixi.js";
import { refreshCanvas } from "../utils/RefreshCanvas";

const DownloadClearButtons: React.FC = () => {
    const context = useContext(AppContext);

    if (!context) {
        return;
    }

    const { app, reset, setReset } = context;

    const handleSave = () => {
        // const region = app?.stage.getBounds();
        const region = new PIXI.Rectangle(0, 0, 1920, 1080);
        const texture = app?.renderer.generateTexture(app.stage, { region });
        const dataURL = app?.renderer.plugins.extract.image(texture).src;

        const a = document.createElement("a");
        a.href = dataURL;
        a.download = "canvas.png";
        document.body.append(a);
        a.click();
        a.remove();

        refreshCanvas(context);
    };

    const handleReset = () => {
        const confirmation = confirm("This will clear the whole canvas. Any progress will be lost!\nClicking OK will proceed the action")
        if (!confirmation) return
        setReset(reset + 1)
    }


    return (
        <div className="absolute bottom-left flex-vertical" id="download-clear-buttons">
            <button className="btn-regular btn-blue" onClick={handleSave}>
                Save
            </button>
            <button className="btn-regular btn-white" onClick={handleReset}>Clear</button>
        </div>
    );
};

export default DownloadClearButtons;
