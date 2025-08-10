import * as PIXI from "pixi.js";
import { getBackground } from "./GetBackground";
import { AdjustmentFilter } from "pixi-filters";

export const sickEffect = async (
    app: PIXI.Application | undefined,
    mainContainer: PIXI.Container
) => {
    const sickContainer = new PIXI.Container();
    const vignette = await getBackground("/img/vignette.png");

    const region = new PIXI.Rectangle(0, 0, 1920, 1080);
    const texture = app?.renderer.generateTexture(mainContainer, {
        region,
    });
    const dataURL = await app?.renderer.extract
        .image(texture)
        .then((img: HTMLImageElement) => img.src);

    const snapshot = await getBackground(dataURL!);

    sickContainer.addChildAt(snapshot, 0);
    sickContainer.addChildAt(vignette, 1);

    let nauseaTime = 0;
    const offsetX = snapshot.x;
    const offsetY = snapshot.y;
    const animateNausea = () => {
        nauseaTime += 0.01;
        snapshot.x = offsetX + Math.sin(nauseaTime * 2) * 30;
        snapshot.y = offsetY + -Math.cos(nauseaTime * 2) * 15;
        requestAnimationFrame(animateNausea);
    };
    animateNausea();

    const adjustmentFilter = new AdjustmentFilter({
        alpha: 0.6,
    });

    snapshot.filters = [adjustmentFilter];

    return sickContainer;
};
