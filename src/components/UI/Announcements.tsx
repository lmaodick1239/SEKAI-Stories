import React, { useContext } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";

const Announcements: React.FC = () => {
    const context = useContext(SettingsContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("5.8.2-announcements");
        if (!cookie) {
            localStorage.setItem("5.8.2-announcements", "0");
            return;
        }
        localStorage.setItem("5.8.2-announcements", `${Number(cookie) + 1}`);
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p>
                New translations have been added! Thanks to{" "}
                <a href="https://github.com/aungpaos">@aungpaos</a> for the Thai
                translation and{" "}
                <a href="https://github.com/39Choko">@39Choko</a> for the French
                translation!
            </p>
            <p>
                Localization contributions are welcome! You can check this
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
