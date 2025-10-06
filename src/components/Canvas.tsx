import { useContext } from "react";
import { SceneContext } from "../contexts/SceneContext";

const Canvas: React.FC = () => {
    const scene = useContext(SceneContext);
    if (!scene) throw new Error("Context not found");

    const { guideline, setGuideline } = scene;

    const handleGuidelineToggle = () => {
        if (!guideline) return;
        guideline.container.visible = !guideline.visible;
        if (setGuideline) {
            setGuideline({ ...guideline, visible: !guideline.visible });
        }
    };

    return (
        <canvas
            height={1080}
            width={1920}
            id="canvas"
            onClick={handleGuidelineToggle}
        />
    );
};
export default Canvas;
