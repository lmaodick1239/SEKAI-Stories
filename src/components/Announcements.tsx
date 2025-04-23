import React, { useContext } from "react";
import { AppContext } from "../contexts/AppContext";

const Announcements: React.FC = () => {
    const context = useContext(AppContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("importantAnnouncement2");
        if (!cookie) {
            localStorage.setItem("importantAnnouncement2", "0");
            return;
        }
        localStorage.setItem("importantAnnouncement2", `${Number(cookie) + 1}`);
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Important Announcement</h2>
            <p>SEKAI Stories has reached bandwidth limit.</p>
            <p>From this point on, Ko-fi funds are being used.</p>
            <p>By a few hours, this site may pause for a while.</p>
            <p>See more information here.</p>
            <button
                onClick={() =>
                    window.open(
                        "https://ko-fi.com/post/SEKAI-Stories-Important-Announcement-A0A01DXJW5",
                        "_blank"
                    )
                }
                className="btn-blue btn-regular"
            >
                Ko-fi Announcement
            </button>
            <p>Tap this section to close.</p>
        </div>
    );
};

export default Announcements;
