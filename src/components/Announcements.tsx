import React, { useContext } from "react";
import { AppContext } from "../contexts/AppContext";

const Announcements: React.FC = () => {
    const context = useContext(AppContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("vercelAnnouncement");
        if (!cookie) {
            localStorage.setItem("vercelAnnouncement", "0");
            return;
        }
        localStorage.setItem("vercelAnnouncement", `${Number(cookie) + 1}`);
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p>Vercel Deployment is back!</p>
            <p>
                Please use Netlify App as well, so bandwidth and traffic can be
                split between the two!
            </p>
            <p>
                Here are the links:{" "}
                <a
                    href="https://sekai-stories.vercel.app/"
                    className="text-orange"
                >
                    Vercel App
                </a>{" "}
                and{" "}
                <a
                    href="https://sekai-stories.netlify.app/"
                    className="text-orange"
                >
                    Netlify App
                </a>
                .
            </p>
            <p>Tap this section to close.</p>
        </div>
    );
};

export default Announcements;
