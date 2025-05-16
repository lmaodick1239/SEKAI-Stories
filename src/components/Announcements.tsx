import React, { useContext } from "react";
import { SceneContext } from "../contexts/SceneContext";

const Announcements: React.FC = () => {
    const context = useContext(SceneContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("redditAd");
        if (!cookie) {
            localStorage.setItem("redditAd", "0");
            return;
        }
        localStorage.setItem("redditAd", `${Number(cookie) + 1}`);
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p>A dedicated subreddit has been made for SEKAI Stories!</p>
            <p>
                It's called{" "}
                <a href="https://reddit.com/r/PJSKStories">r/PJSKStories</a>.
                Take a visit~
            </p>
            <p>
                Localization contributions are still welcome! You can check this
                information on{" "}
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
