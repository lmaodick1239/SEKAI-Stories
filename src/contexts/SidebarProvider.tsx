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
    const [showExperimental, setShowExperimental] = useState<boolean>(false);
    const [openAll, setOpenAll] = useState<boolean>(false);
    const [openTextOption, setOpenTextOption] = useState<string>("name-tag");
    const [allowRefresh, setAllowRefresh] = useState<boolean>(false);

    useEffect(() => {
        const announcementCookie = localStorage.getItem("localization-q");
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
    }, []);

    return (
        <SidebarContext.Provider
            value={{
                openedSidebar,
                setOpenedSidebar,
                hide,
                setHide,
                hideAnnouncements,
                setHideAnnouncements,
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
