import { useCallback, useContext, useEffect, useRef } from "react";
import { SettingsContext } from "../contexts/SettingsContext";

export const useAudioManager = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error("SettingsContext not found");

    const { audio } = context;
    const audioRef = useRef(audio);

    useEffect(() => {
        audioRef.current = audio;
    }, [audio]);

    const playSound = useCallback((sound: string) => {
        if (audioRef.current) {
            new Audio(sound).play();
        }
    }, []);

    return { playSound };
};
