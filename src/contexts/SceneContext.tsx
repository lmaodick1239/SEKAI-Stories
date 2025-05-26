import { createContext } from "react";
import ISceneContextType from "../types/ISceneContextType";

export const SceneContext = createContext<ISceneContextType | undefined>(
    undefined
);
