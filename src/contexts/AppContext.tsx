import { createContext } from "react";
import IAppContextType from "../types/IAppContextType";

export const AppContext = createContext<IAppContextType | undefined>(undefined);
