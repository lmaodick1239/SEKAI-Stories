import { Dispatch, SetStateAction } from "react";

export default interface ISettingsContextType {
    openedSidebar: string;
    setOpenedSidebar: Dispatch<SetStateAction<string>>;
    hide: boolean;
    setHide: Dispatch<SetStateAction<boolean>>;
    hideAnnouncements: boolean;
    setHideAnnouncements: Dispatch<SetStateAction<boolean>>;
    showTutorial: boolean;
    setShowTutorial: Dispatch<SetStateAction<boolean>>;
    blankCanvas: boolean;
    setBlankCanvas: Dispatch<SetStateAction<boolean>>;
    showExperimental: boolean;
    setShowExperimental: Dispatch<SetStateAction<boolean>>;
    showSaveDialog: boolean;
    setShowSaveDialog: Dispatch<SetStateAction<boolean>>;
    openAll: boolean;
    setOpenAll: Dispatch<SetStateAction<boolean>>;
    openTextOption: string;
    setOpenTextOption: Dispatch<SetStateAction<string>>;
    allowRefresh: boolean;
    setAllowRefresh: Dispatch<SetStateAction<boolean>>;
    audio: boolean;
    setAudio: Dispatch<SetStateAction<boolean>>;
}
