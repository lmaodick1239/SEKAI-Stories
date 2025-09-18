import React, { useContext } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";

const Announcements: React.FC = () => {
    const context = useContext(SettingsContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("5.8.0-announcements");
        if (!cookie) {
            localStorage.setItem("5.8.0-announcements", "0");
            return;
        }
        localStorage.setItem("5.8.0-announcements", `${Number(cookie) + 1}`);
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p>There are some few updates just added:</p>
            <ul>
                <li>
                    Added foreground lighting adjustment to fit with the
                    background's mood
                </li>
                <li>Added new models and background</li>
                <li>Fixed issue on layer ordering</li>
                <li>
                    Malay translation is now available! (Thanks to{" "}
                    <a
                        href="https://github.com/fab144"
                        target="_blank"
                        className=""
                    >
                        lzington
                    </a>{" "}
                    for their contribution!)
                </li>
            </ul>
            <p>Tap this section to close.</p>
        </div>
    );
};

export default Announcements;
