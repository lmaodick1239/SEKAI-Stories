import React, { useContext } from "react";
import { SidebarContext } from "../../contexts/SidebarContext";

const Announcements: React.FC = () => {
    const context = useContext(SidebarContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("splitlocationupdate");
        if (!cookie) {
            localStorage.setItem("splitlocationupdate", "0");
            return;
        }
        localStorage.setItem("splitlocationupdate", `${Number(cookie) + 1}`);
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p>New features has been added! See more information below.</p>

            <button
                className="btn-blue btn-regular"
                onClick={() => {
                    window.open(
                        "https://ko-fi.com/Post/SEKAI-Stories-New-Features-M4M61GE1WD",

                        "_blank"
                    );
                }}
            >
                Ko-fi Announcement
            </button>
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
