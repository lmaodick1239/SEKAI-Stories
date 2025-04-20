import React, { useContext } from "react";
import { AppContext } from "../contexts/AppContext";

const Announcements: React.FC = () => {
    const context = useContext(AppContext);

    if (!context) return;

    const { setHideAnnouncements } = context;

    const handleAnnouncements = () => {
        setHideAnnouncements(true);
        const cookie = localStorage.getItem("linkAnnouncement");
        if (!cookie) {
            localStorage.setItem("linkAnnouncement", "0");
            return;
        }
        localStorage.setItem("linkAnnouncement", `${Number(cookie) + 1}`);
    };

    return (
        <div id="announcements" onClick={handleAnnouncements}>
            <h2>Notice</h2>
            <p>SEKAI Stories has two available links.</p>
            <p>
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
            <p>You can always switch to another if the other fails.</p>
            <p>Tap this section to close.</p>
        </div>
    );
};

export default Announcements;
