import { useEffect, useState } from "react";
import { SidebarContext } from "./SidebarContext";

interface SidebarProviderProps {
    children: React.ReactNode;
}
export const SidebarProvider: React.FC<SidebarProviderProps> = ({
    children,
}) => {
    const [openedSidebar, setOpenedSidebar] = useState<string>("text");
    const [hide, setHide] = useState<boolean>(false);
    const [hideAnnouncements, setHideAnnouncements] = useState<boolean>(true);
    const [showTutorial, setShowTutorial] = useState<boolean>(false);
    const [showExperimental, setShowExperimental] = useState<boolean>(false);
    const [openAll, setOpenAll] = useState<boolean>(false);
    const [openTextOption, setOpenTextOption] = useState<string>("name-tag");
    const [allowRefresh, setAllowRefresh] = useState<boolean>(false);

    useEffect(() => {
        const announcementCookie = localStorage.getItem("splitlocationupdate");
        if (Number(announcementCookie) < 1) {
            setHideAnnouncements(false);
        }
        const experimentalCookie = localStorage.getItem("showExperimental");
        if (experimentalCookie === "true") {
            setShowExperimental(true);
        }
        const openAllCookie = localStorage.getItem("openAll");
        if (openAllCookie === "true") {
            setOpenAll(true);
        }
        const showTutorialCookie = localStorage.getItem("showTutorialAndSetup");
        if (!showTutorialCookie || showTutorialCookie === "true") {
            setShowTutorial(true);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("showTutorialAndSetup", String(showTutorial));
    }, [showTutorial]);

    return (
        <SidebarContext.Provider
            value={{
                openedSidebar,
                setOpenedSidebar,
                hide,
                setHide,
                hideAnnouncements,
                setHideAnnouncements,
                showTutorial,
                setShowTutorial,
                showExperimental,
                setShowExperimental,
                openAll,
                setOpenAll,
                openTextOption,
                setOpenTextOption,
                allowRefresh,
                setAllowRefresh,
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
};
