import { useEffect, useState } from "react";
import { SettingsContext } from "./SettingsContext";
import { IEasyNameTag } from "../types/IEasyNameTag";

interface SidebarProviderProps {
    children: React.ReactNode;
}
export const SettingsProvider: React.FC<SidebarProviderProps> = ({
    children,
}) => {
    const month = new Date().getMonth() * -1 + 1;
    const [openedSidebar, setOpenedSidebar] = useState<string>("text");
    const [hide, setHide] = useState<boolean>(false);
    const [hideAnnouncements, setHideAnnouncements] = useState<boolean>(true);
    const [showTutorial, setShowTutorial] = useState<boolean>(false);
    const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false);
    const [blankCanvas, setBlankCanvas] = useState<boolean>(
        month === 10 ? true : false
    );
    const [showExperimental, setShowExperimental] = useState<boolean>(false);
    const [openAll, setOpenAll] = useState<boolean>(false);
    const [openTextOption, setOpenTextOption] = useState<string>("name-tag");
    const [openModelOption, setOpenModelOption] =
        useState<string>("select-layer");
    const [nameTags, setNameTags] = useState<IEasyNameTag>({});
    const [nameTagInputs, setNameTagInputs] = useState<number>(2);
    const [easySwitch, setEasySwitch] = useState<boolean>(false);
    const [allowRefresh, setAllowRefresh] = useState<boolean>(false);
    const [audio, setAudio] = useState<boolean>(false);
    const [loading, setLoading] = useState<number>(0);

    useEffect(() => {
        const announcementCookie = localStorage.getItem("5.8.4-announcements");
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
        const audioCookie = localStorage.getItem("audio");
        if (!audioCookie || audioCookie === "true") {
            setAudio(true);
        }
        const saveDialogCookie = localStorage.getItem("saveDialog");
        if (!saveDialogCookie || saveDialogCookie === "true") {
            setShowSaveDialog(true);
        }
        const blankCanvasCookie = localStorage.getItem(
            month === 10 ? "blankCanvasOctober" : "blankCanvas"
        );
        if (month === 10 && blankCanvasCookie === "false") {
            setBlankCanvas(false);
        } else if (blankCanvasCookie === "true") {
            setBlankCanvas(true);
        }
        const easySwitchEnabled = localStorage.getItem("easySwitchEnabled");
        if (easySwitchEnabled === "true") {
            setEasySwitch(true);
        }
        const storedNameTags = localStorage.getItem("nameTags");
        if (storedNameTags) {
            setNameTags(JSON.parse(storedNameTags));
        }
        const storedNameTagInputs = localStorage.getItem("nameTagInputs");
        if (storedNameTagInputs) {
            setNameTagInputs(Number(storedNameTagInputs));
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
                openModelOption,
                setOpenModelOption,
                easySwitch,
                setEasySwitch,
                nameTags,
                setNameTags,
                nameTagInputs,
                setNameTagInputs,
                allowRefresh,
                setAllowRefresh,
                audio,
                setAudio,
                loading,
                setLoading,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};
