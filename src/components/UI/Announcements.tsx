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
            <p>Just got back from the dead~ I'm now free~</p>
            <p>There are some few updates just added:</p>
            <ul>
                <li>Added foreground lighting adjustment to fit with the background's mood</li>
                <li>Added new models and background</li>
                <li>Fixed issue on layer ordering</li>
                {/* <li>Malay translation is now available! (Thanks to <a></a> for their contribution!)</li> */}
            </ul>
        </div>
    );
};

export default Announcements;
