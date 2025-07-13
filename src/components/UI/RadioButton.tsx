import React from "react";

interface RadioButtonProps {
    name: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    id?: string;
    data?: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({
    name,
    value,
    onChange,
    id = "",
    data,
}) => {
    return (
        <label className="custom-radio-button">
            <input
                type="radio"
                name={name}
                value={value}
                onChange={onChange}
                id={id}
                checked={data === value}
            />
            <span className="checkmark" />
        </label>
    );
};

export default RadioButton;
