import React, { useContext } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";

const Announcements: React.FC = () => {
    const context = useContext(SettingsContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("5.4.0-announcements");
        if (!cookie) {
            localStorage.setItem("5.4.0-announcements", "0");
            return;
        }
        localStorage.setItem("5.4.0-announcements", `${Number(cookie) + 1}`);
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p></p>
            <p>New features has been added! See more information below.</p>
            <button
                className="btn-regular btn-blue"
                onClick={() => {
                    window.open(
                        "https://ko-fi.com/post/SEKAI-Stories-New-Features-Y8Y31HA0RW",
                        "_blank"
                    );
                }}
            >
                Ko-fi Announcement
            </button>
            <p>
                You can still give feedback on this <a href="https://forms.gle/G2J3gZnsSXSd2G5f6" target="_blank">Feedback form</a> if you have any issues or suggestions.
            </p>
            <p>Tap this section to close.</p>
        </div>
    );
};

export default Announcements;
