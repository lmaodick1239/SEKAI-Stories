import { createContext } from "react";
import ISoftErrorContextType from "../types/ISoftErrorContextType";

export const SoftErrorContext = createContext<ISoftErrorContextType | undefined>(
    undefined
);
