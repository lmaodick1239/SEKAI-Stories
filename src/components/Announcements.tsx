import React, { useContext } from "react";
import { SceneContext } from "../contexts/SceneContext";

const Announcements: React.FC = () => {
    const context = useContext(SceneContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("simplifiedChineseLocalizationAnnouncement");
        if (!cookie) {
            localStorage.setItem("simplifiedChineseLocalizationAnnouncement", "0");
            return;
        }
        localStorage.setItem(
            "simplifiedChineseLocalizationAnnouncement",
            `${Number(cookie) + 1}`
        );
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p>
                Simplified Chinese localization is now available! Thanks to{" "}
                <a href="https://github.com/MiddleRed">@MiddleRed</a> for
                their contribution!
            </p>
            <p>
                If you also wish to contribute, you can check this information
                on{" "}
                <a
                    href="https://github.com/lezzthanthree/SEKAI-Stories/blob/master/README-localization.md"
                    className="text-orange"
                    target="_blank"
                >
                    GitHub
                </a>
                .
            </p>
            <p>Tap this section to close.</p>
        </div>
    );
};

export default Announcements;
