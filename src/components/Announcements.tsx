import React, { useContext } from "react";
import { AppContext } from "../contexts/AppContext";

const Announcements: React.FC = () => {
    const context = useContext(AppContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("localizationAnnouncement");
        if (!cookie) {
            localStorage.setItem("localizationAnnouncement", "0");
            return;
        }
        localStorage.setItem(
            "localizationAnnouncement",
            `${Number(cookie) + 1}`
        );
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p>Contributions for localization are now available!</p>
            <p>
                If you wish to contribute, you can check this information on{" "}
                <a
                    href="https://github.com/lezzthanthree/SEKAI-Stories/README-localization.md"
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
