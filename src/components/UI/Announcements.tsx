import React, { useContext } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";

const Announcements: React.FC = () => {
    const context = useContext(SettingsContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("5.8.9-announcements");
        if (!cookie) {
            localStorage.setItem("5.8.9-announcements", "0");
            return;
        }
        localStorage.setItem("5.8.9-announcements", `${Number(cookie) + 1}`);
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p>There are few things that got updated.</p>
            <ul></ul>
            <ul>
                <li>
                    Traditional Chinese (Hong Kong and Taiwan) Translation is
                    now available! Thanks to{" "}
                    <a href="https://github.com/lmaodick1239" target="_blank">
                        Ed
                    </a>{" "}
                    for their contribution!
                </li>
                <li>
                    File extensions for JSON files have been changed to
                    .sekaiscene for Scene Saves and .sekai2d for Live2D
                    Parameter Saves. (.json will still work)
                </li>
                <li>Y-Offset under Text Menu is replaced with a Window UI</li>
                <li>Added PJSK Cards as of 2025-10-20 as backgrounds. You can view them by selecting "Cards" on the filter.</li>
                <li>Added new backgrounds.</li>
            </ul>
            <p>
                Translation contributions are still welcome! You can check this
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
