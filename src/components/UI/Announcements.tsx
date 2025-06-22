import React, { useContext } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";

const Announcements: React.FC = () => {
    const context = useContext(SettingsContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("fewUpdates-5.3.1");
        if (!cookie) {
            localStorage.setItem("fewUpdates-5.3.1", "0");
            return;
        }
        localStorage.setItem("fewUpdates-5.3.1", `${Number(cookie) + 1}`);
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p>Few updates have been pushed:</p>
            <ul>
                <li>Added new models from N25 WL.</li>
                <li>Sound effects can now be disabled.</li>
            </ul>
            <p>
                Localization contributions are still welcome! You can check this
                information on{" "}
                <a
                    href="https://github.com/lezzthanthree/SEKAI-Stories/blob/master/README-localization.md"
                    className="text-orange"
                    target="_blank"
                >
                    GitHub
                </a>
                .
            </p>
            <p>Tap this section to close.</p>
        </div>
    );
};

export default Announcements;
