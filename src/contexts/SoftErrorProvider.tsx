import { useEffect, useState } from "react";
import { SoftErrorContext } from "./SoftErrorContext";

interface SoftErrorProviderProps {
    children: React.ReactNode;
}

export const SoftErrorProvider: React.FC<SoftErrorProviderProps> = ({
    children,
}) => {
    const [errorInformation, setErrorInformation] = useState<string>("");
    const [showErrorInformation, setShowErrorInformation] =
        useState<boolean>(false);

    useEffect(() => {
        if (errorInformation) {
            setShowErrorInformation(true);
        }
    }, [errorInformation]);


    return (
        <SoftErrorContext.Provider
            value={{
                errorInformation,
                setErrorInformation,
                showErrorInformation,
                setShowErrorInformation,
            }}
        >
            {children}
        </SoftErrorContext.Provider>
    );
};
