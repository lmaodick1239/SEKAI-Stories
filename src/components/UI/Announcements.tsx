import React, { useContext } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";

const Announcements: React.FC = () => {
    const context = useContext(SettingsContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("feedbackII");
        if (!cookie) {
            localStorage.setItem("feedbackII", "0");
            return;
        }
        localStorage.setItem("feedbackII", `${Number(cookie) + 1}`);
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p>I'd love to hear about your experience using SEKAI Stories!</p>
            <p>If you'd like to, please tap the Feedback form button!</p>
            <button
                className="btn-regular btn-blue"
                onClick={() => {
                    window.open(
                        "https://forms.gle/G2J3gZnsSXSd2G5f6",
                        "_blank"
                    );
                }}
            >
                Feedback
            </button>
            <p>Tap this section to close.</p>
        </div>
    );
};

export default Announcements;
