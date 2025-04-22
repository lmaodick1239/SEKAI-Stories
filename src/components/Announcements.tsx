import React, { useContext } from "react";
import { AppContext } from "../contexts/AppContext";

const Announcements: React.FC = () => {
    const context = useContext(AppContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("importantAnnouncement");
        if (!cookie) {
            localStorage.setItem("importantAnnouncement", "0");
            return;
        }
        localStorage.setItem("importantAnnouncement", `${Number(cookie) + 1}`);
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Important Announcement</h2>
            <p>SEKAI Stories is nearing its bandwidth limit.</p>
            <p>In approximately 25 hours, the website may pause for a while.</p>
            <p>See more information here.</p>
            <button
                onClick={() => window.open("https://ko-fi.com/post/SEKAI-Stories-Nearing-Bandwidth-Limit-F1F71DWA1M", "_blank")}
                className="btn-blue btn-regular"
            >
                Ko-fi Announcement
            </button>
            <p>Tap this section to close.</p>
        </div>
    );
};

export default Announcements;
