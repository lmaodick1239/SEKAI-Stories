import React, { Dispatch, SetStateAction, useContext } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";

interface SidebarOptionProps {
    header: string;
    option: string;
    setOption: Dispatch<SetStateAction<string>>;
    optionName: string;
    children: React.ReactNode;
}

const SidebarOption: React.FC<SidebarOptionProps> = ({
    header,
    option,
    setOption,
    optionName,
    children,
}) => {
    const settings = useContext(SettingsContext);

    if (!settings) throw new Error("Context not found");

    const { openAll } = settings;

    return (
        <div
            className="option"
            onClick={() => {
                setOption(optionName);
            }}
        >
            <div className="space-between flex-horizontal center">
                <h2>{header}</h2>
                {openAll || option === optionName ? (
                    <i className="bi bi-caret-down-fill" />
                ) : (
                    <i className="bi bi-caret-right-fill" />
                )}
            </div>
            {(openAll || option === optionName) && (
                <div className="option__content">{children}</div>
            )}
        </div>
    );
};

export default SidebarOption;
