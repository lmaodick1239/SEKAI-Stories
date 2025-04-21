import React, { useContext } from "react";
import { AppContext } from "../contexts/AppContext";

const Announcements: React.FC = () => {
    const context = useContext(AppContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("pngSprite");
        if (!cookie) {
            localStorage.setItem("pngSprite", "0");
            return;
        }
        localStorage.setItem("pngSprite", `${Number(cookie) + 1}`);
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p>Initial model of Airi is changed to a PNG to save bandwidth.</p>
            <p>Tap this section to close.</p>
        </div>
    );
};

export default Announcements;
