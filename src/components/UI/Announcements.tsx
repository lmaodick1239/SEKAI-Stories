import React, { useContext } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";

const Announcements: React.FC = () => {
    const context = useContext(SettingsContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("5.7.2-announcements");
        if (!cookie) {
            localStorage.setItem("5.7.2-announcements", "0");
            return;
        }
        localStorage.setItem("5.7.2-announcements", `${Number(cookie) + 1}`);
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p></p>
            <p>
                just wanna say happy{" "}
                {new Date() > new Date("2025-10-27") ? "(late)" : ""} birthday
                to my sweetest and dearest mizuki.
            </p>
            <p>(fixed the models disappearing bug, btw~)</p>
            <p>Tap this section to close.</p>
        </div>
    );
};

export default Announcements;
