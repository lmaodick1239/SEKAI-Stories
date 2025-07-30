import React, { useContext } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";

const Announcements: React.FC = () => {
    const context = useContext(SettingsContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("5.7.0-announcements");
        if (!cookie) {
            localStorage.setItem("5.7.0-announcements", "0");
            return;
        }
        localStorage.setItem("5.7.0-announcements", `${Number(cookie) + 1}`);
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p></p>
            <p>There are few new updates just added!</p>
            <ul>
                <li> Moved upload button on Add Model Screen </li>
                <li> Added Visible button beside the delete button </li>
                <li> Allow playing emotions simultaneously </li>
                <li> Updated to PIXI.js 7 </li>
            </ul>
            <p>
                <a href="https://reddit.com/r/PJSKStories" target="_blank">
                    r/PJSKStories
                </a>{" "}
                just reached 1k members!
            </p>
            <p>Tap this section to close.</p>
        </div>
    );
};

export default Announcements;
