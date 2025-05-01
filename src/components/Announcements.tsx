import React, { useContext } from "react";
import { AppContext } from "../contexts/AppContext";

const Announcements: React.FC = () => {
    const context = useContext(AppContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("polishLocalizationAnnouncement");
        if (!cookie) {
            localStorage.setItem("polishLocalizationAnnouncement", "0");
            return;
        }
        localStorage.setItem(
            "polishLocalizationAnnouncement",
            `${Number(cookie) + 1}`
        );
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p>
                Polish localization is now available! Thanks to{" "}
                <a href="https://github.com/counter185">@counter185</a> for
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
