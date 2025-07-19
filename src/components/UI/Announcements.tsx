import React, { useContext } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";

const Announcements: React.FC = () => {
    const context = useContext(SettingsContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("5.6.0-announcements");
        if (!cookie) {
            localStorage.setItem("5.6.0-announcements", "0");
            return;
        }
        localStorage.setItem("5.6.0-announcements", `${Number(cookie) + 1}`);
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p></p>
            <p>There are few new updates just added!</p>
            <ul>
                <li> Implement layer reordering buttons </li>
                <li> Implement renaming of emotions </li>
                <li> Added droopling lines filter </li>
                <li> Added cancel when loading a model </li>
                <li> Removed generic input window </li>
                <li> Remember last model option opened </li>
                <li> Updated Chinese (Simplified) localization </li>
            </ul>
            <p>I also want to congratulate Hina Kino (木野日菜) for her newborn baby!</p>
            <p>Tap this section to close.</p>
        </div>
    );
};

export default Announcements;
