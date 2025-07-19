import { Dispatch, SetStateAction } from "react";
import { IEasyNameTag } from "./IEasyNameTag";

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
    easySwitch: boolean;
    setEasySwitch: Dispatch<SetStateAction<boolean>>;
    nameTags: IEasyNameTag;
    setNameTags: Dispatch<SetStateAction<IEasyNameTag>>;
    nameTagInputs: number;
    setNameTagInputs: Dispatch<SetStateAction<number>>;
    openTextOption: string;
    setOpenTextOption: Dispatch<SetStateAction<string>>;
    openModelOption: string;
    setOpenModelOption: Dispatch<SetStateAction<string>>;
    allowRefresh: boolean;
    setAllowRefresh: Dispatch<SetStateAction<boolean>>;
    audio: boolean;
    setAudio: Dispatch<SetStateAction<boolean>>;
    loading: number;
    setLoading: Dispatch<SetStateAction<number>>;
}
