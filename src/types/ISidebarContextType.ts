import { Dispatch, SetStateAction } from "react";

export default interface ISidebarContextType {
    openedSidebar: string;
    setOpenedSidebar: Dispatch<SetStateAction<string>>;
    hide: boolean;
    setHide: Dispatch<SetStateAction<boolean>>;
    hideAnnouncements: boolean;
    setHideAnnouncements: Dispatch<SetStateAction<boolean>>;
    showTutorial: boolean;
    setShowTutorial: Dispatch<SetStateAction<boolean>>;
    showExperimental: boolean;
    setShowExperimental: Dispatch<SetStateAction<boolean>>;
    openAll: boolean;
    setOpenAll: Dispatch<SetStateAction<boolean>>;
    openTextOption: string;
    setOpenTextOption: Dispatch<SetStateAction<string>>;
    allowRefresh: boolean;
    setAllowRefresh: Dispatch<SetStateAction<boolean>>;
}
