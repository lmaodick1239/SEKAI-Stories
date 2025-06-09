import React, { useContext } from "react";
import { SidebarContext } from "../../contexts/SidebarContext";

const Announcements: React.FC = () => {
    const context = useContext(SidebarContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("localization-q");
        if (!cookie) {
            localStorage.setItem("localization-q", "0");
            return;
        }
        localStorage.setItem("localization-q", `${Number(cookie) + 1}`);
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
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
