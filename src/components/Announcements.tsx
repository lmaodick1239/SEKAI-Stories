import React, { useContext } from "react";
import { AppContext } from "../contexts/AppContext";

const Announcements: React.FC = () => {
    const context = useContext(AppContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("netlifyHaltAnnouncement");
        if (!cookie) {
            localStorage.setItem("netlifyHaltAnnouncement", "0");
            return;
        }
        localStorage.setItem(
            "netlifyHaltAnnouncement",
            `${Number(cookie) + 1}`
        );
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p>
                Netlify deployment has been halted due to reaching the bandwidth
                limit.
            </p>
            <p>It'll be fine, guys! The website will be back next month~</p>
            <p>Tap this section to close.</p>
        </div>
    );
};

export default Announcements;
