import React, { useContext } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";

const Announcements: React.FC = () => {
    const context = useContext(SettingsContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("5.8.8-announcements");
        if (!cookie) {
            localStorage.setItem("5.8.8-announcements", "0");
            return;
        }
        localStorage.setItem("5.8.8-announcements", `${Number(cookie) + 1}`);
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p>
                The unexpected bug that caused the application to crash has just
                been fixed.
            </p>
            <p>
                The issue was caused by the auto-translate feature in Chrome or other
                browser.
            </p>
            <p>
                For more details, you can view this{" "}
                <a
                    href="https://github.com/lezzthanthree/SEKAI-Stories/issues/25"
                    target="_blank"
                >
                    GitHub issue
                </a>
                .
            </p>

            <p>Tap this section to close.</p>
        </div>
    );
};

export default Announcements;
