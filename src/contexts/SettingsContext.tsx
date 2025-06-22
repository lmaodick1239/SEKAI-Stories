import { createContext } from "react";
import ISettingsContextType from "../types/ISettingsContextType";

export const SettingsContext = createContext<ISettingsContextType | undefined>(
    undefined
);
