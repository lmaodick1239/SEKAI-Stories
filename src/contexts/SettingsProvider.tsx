import { useEffect, useState } from "react";
import { SettingsContext } from "./SettingsContext";

interface SidebarProviderProps {
    children: React.ReactNode;
}
export const SettingsProvider: React.FC<SidebarProviderProps> = ({
    children,
}) => {
    const [openedSidebar, setOpenedSidebar] = useState<string>("text");
    const [hide, setHide] = useState<boolean>(false);
    const [hideAnnouncements, setHideAnnouncements] = useState<boolean>(true);
    const [showTutorial, setShowTutorial] = useState<boolean>(false);
    const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false);
    const [blankCanvas, setBlankCanvas] = useState<boolean>(false);
    const [showExperimental, setShowExperimental] = useState<boolean>(false);
    const [openAll, setOpenAll] = useState<boolean>(false);
    const [openTextOption, setOpenTextOption] = useState<string>("name-tag");
    const [allowRefresh, setAllowRefresh] = useState<boolean>(false);
    const [audio, setAudio] = useState<boolean>(false);

    useEffect(() => {
        const announcementCookie = localStorage.getItem("feedbackII");
        if (Number(announcementCookie) < 2) {
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
        const audioCookie = localStorage.getItem("audio");
        if (!audioCookie || audioCookie === "true") {
            setAudio(true);
        }
        const saveDialogCookie = localStorage.getItem("saveDialog");
        if (!saveDialogCookie || saveDialogCookie === "true") {
            setShowSaveDialog(true);
        }
        const blankCanvasCookie = localStorage.getItem("blankCanvas");
        if (blankCanvasCookie === "true") {
            setBlankCanvas(true);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("showTutorialAndSetup", String(showTutorial));
    }, [showTutorial]);

    return (
        <SettingsContext.Provider
            value={{
                openedSidebar,
                setOpenedSidebar,
                hide,
                setHide,
                hideAnnouncements,
                setHideAnnouncements,
                showTutorial,
                setShowTutorial,
                blankCanvas,
                setBlankCanvas,
                showExperimental,
                setShowExperimental,
                showSaveDialog,
                setShowSaveDialog,
                openAll,
                setOpenAll,
                openTextOption,
                setOpenTextOption,
                allowRefresh,
                setAllowRefresh,
                audio,
                setAudio,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};
