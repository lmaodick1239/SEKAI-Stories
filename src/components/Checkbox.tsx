import React from "react";

interface CheckboxProps {
    id: string;
    label: string;
    checked: boolean | undefined;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({
    id,
    label,
    checked,
    onChange,
}) => {
    return (
        <div className="checkbox">
            <input
                type="checkbox"
                name={id}
                id={id}
                checked={checked}
                onChange={onChange}
                className="checkbox__input"
            />
            <label className="checkbox__label" htmlFor={id}>
                {label}
            </label>
        </div>
    );
};
