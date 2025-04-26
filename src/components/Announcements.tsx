import React, { useContext } from "react";
import { AppContext } from "../contexts/AppContext";

const Announcements: React.FC = () => {
    const context = useContext(AppContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("thankYouAnnouncement");
        if (!cookie) {
            localStorage.setItem("thankYouAnnouncement", "0");
            return;
        }
        localStorage.setItem("thankYouAnnouncement", `${Number(cookie) + 1}`);
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p>Some models may be missing, but will be added sooner.</p>
            <p>Thank you for your patience, and I sincerely apologize for the temporary pausing of the project.</p>
            <p>Tap this section to close.</p>
        </div>
    );
};

export default Announcements;
