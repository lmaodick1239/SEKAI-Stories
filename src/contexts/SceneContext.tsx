import { createContext } from "react";
import ISceneContextType from "../types/IAppContextType";

export const SceneContext = createContext<ISceneContextType | undefined>(
    undefined
);
