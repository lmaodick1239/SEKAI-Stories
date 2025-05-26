import React, { useContext } from "react";
import { SidebarContext } from "../contexts/SidebarContext";

const Announcements: React.FC = () => {
    const context = useContext(SidebarContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("minorUpdate1");
        if (!cookie) {
            localStorage.setItem("minorUpdate1", "0");
            return;
        }
        localStorage.setItem("minorUpdate1", `${Number(cookie) + 1}`);
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p>
                A few minor updates have been pushed!
            </p>
            <ul>
                <li>Added snapping to x-offset and y-offset sliders</li>
                <li>Added a toggle to expand all menu options in Settings</li>
                <li>Moved model's/sprite's anchor to the center</li>
            </ul>            
            <p>Tap this section to close.</p>
        </div>
    );
};

export default Announcements;
