import { Dispatch, SetStateAction } from "react";

export default interface ISoftErrorContextType {
    errorInformation: string;
    setErrorInformation: Dispatch<SetStateAction<string>>;
    showErrorInformation: boolean;
    setShowErrorInformation: Dispatch<SetStateAction<boolean>>;
}
