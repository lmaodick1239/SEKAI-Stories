import React from "react";

interface RadioButtonProps {
    name: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({ name, value, onChange }) => {
    return (
        <label className="custom-radio-button">
            <input type="radio" name={name} value={value} onChange={onChange} />
            <span className="checkmark" />
        </label>
    );
};

export default RadioButton;
