import React, { useContext } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";

const Announcements: React.FC = () => {
    const context = useContext(SettingsContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("5.8.4-announcements");
        if (!cookie) {
            localStorage.setItem("5.8.4-announcements", "0");
            return;
        }
        localStorage.setItem("5.8.4-announcements", `${Number(cookie) + 1}`);
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p>oooo, spooky month</p>
            <p>
                Blank canvas is enabled by default. There are new random default
                scenes you can get this October～
            </p>
            <p>You can disable this option on Settings.</p>
            <p>Tap this section to close.</p>
        </div>
    );
};

export default Announcements;
