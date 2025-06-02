import React, { useContext } from "react";
import { SidebarContext } from "../contexts/SidebarContext";

const Announcements: React.FC = () => {
    const context = useContext(SidebarContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("minorUpdate2");
        if (!cookie) {
            localStorage.setItem("minorUpdate2", "0");
            return;
        }
        localStorage.setItem("minorUpdate2", `${Number(cookie) + 1}`);
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p>
                A few minor updates have been pushed!
            </p>
            <ul>
                <li>Added few new backgrounds</li>
                <li>Added few new models</li>
                <li>Fixed issue that disallows users to add new model</li>
            </ul>            
            <p>Tap this section to close.</p>
        </div>
    );
};

export default Announcements;
