import React, { useContext } from "react";
import { AppContext } from "../contexts/AppContext";

const Announcements: React.FC = () => {
    const context = useContext(AppContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("supportAnnouncement");
        if (!cookie) {
            localStorage.setItem("supportAnnouncement", "0");
            return;
        }
        localStorage.setItem("supportAnnouncement", `${Number(cookie) + 1}`);
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p>
                If you enjoy using SEKAI Stories, you can support the website by
                donation or contributing!
            </p>
            <p>Please click the support button for more information.</p>
            <p>Tap this section to close.</p>
            
        </div>
    );
};

export default Announcements;
