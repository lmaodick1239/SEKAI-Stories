import { createContext } from "react";
import ISidebarContextType from "../types/ISidebarContextType";

export const SidebarContext = createContext<ISidebarContextType | undefined>(
    undefined
);
