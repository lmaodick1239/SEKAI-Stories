import React, { useContext } from "react";
import { AppContext } from "../contexts/AppContext";

const Announcements: React.FC = () => {
    const context = useContext(AppContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("sekaiViewerAnnouncement2");
        if (!cookie) {
            localStorage.setItem("sekaiViewerAnnouncement2", "0");
            return;
        }
        localStorage.setItem(
            "sekaiViewerAnnouncement2",
            `${Number(cookie) + 1}`
        );
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p>
                This site can now use{" "}
                <a href="https://sekai.best">Sekai Viewer's (sekai.best)</a>{" "}
                Live2D models! Give it a test by adding a new model.
            </p>
            <p>
                I would like to thank the owner of Sekai Viewer for allowing me
                to connect their server through this site!
            </p>
            <button
                className="btn-blue btn-regular"
                onClick={() => window.open("https://ko-fi.com/post/Sekai-Viewer-has-responded-F1F31E58CH", "_blank")}
            >
                Ko-fi Announcement
            </button>
            <p>Tap this section to close.</p>
        </div>
    );
};

export default Announcements;
