import React, { useContext } from "react";
import { SceneContext } from "../contexts/SceneContext";

const Announcements: React.FC = () => {
    const context = useContext(SceneContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("featureAnnouncement");
        if (!cookie) {
            localStorage.setItem("featureAnnouncement", "0");
            return;
        }
        localStorage.setItem("featureAnnouncement", `${Number(cookie) + 1}`);
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p>New features has been added! See more information below.</p>
            <button
                className="btn-blue btn-regular"
                onClick={() => {
                    window.open(
                        "https://ko-fi.com/post/SEKAI-Stories-New-Features-T6T51ERVXZ",
                        "_blank"
                    );
                }}
            >
                Ko-fi Announcement
            </button>
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
