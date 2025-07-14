import React, { useContext } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";

const Announcements: React.FC = () => {
    const context = useContext(SettingsContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("5.5.1-announcements");
        if (!cookie) {
            localStorage.setItem("5.5.1-announcements", "0");
            return;
        }
        localStorage.setItem("5.5.1-announcements", `${Number(cookie) + 1}`);
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p></p>
            <p>New features have been added! See more information below.</p>
            <button
                className="btn-regular btn-blue"
                onClick={() => {
                    window.open(
                        "https://ko-fi.com/post/SEKAI-Stories-New-Features-U6U01HYONB",
                        "_blank"
                    );
                }}
            >
                Ko-fi Announcement
            </button>
            <p>
                Chinese (Simplified) translation is now recently updated! Thanks
                to SteveLF for their contribution!
            </p>
            <p>
                Translation contributions are still welcome! You can check this
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