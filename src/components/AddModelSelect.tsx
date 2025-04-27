import React from "react";

interface AddModelSelectProps {
    addModel: (from: string) => void;
    setShow: (state: boolean) => void;
}

const AddModelSelect: React.FC<AddModelSelectProps> = ({
    addModel,
    setShow,
}) => {
    return (
        <div
            id="add-model-select-screen"
            onClick={(e) => {
                e.stopPropagation();
                setShow(false);
            }}
        >
            <div
                className="window window-center"
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <button
                    className="btn-blue btn-regular btn-extend-width"
                    onClick={() => {
                        addModel("sekai");
                        setShow(false);
                    }}
                >
                    Add model from sekai.best
                    <p>Get access to models provided by Sekai Viewer!</p>
                </button>
                <button
                    className="btn-blue btn-regular btn-extend-width"
                    onClick={() => {
                        addModel("static");
                        setShow(false);
                    }}
                >
                    Add model from SEKAI Stories
                    <p>Fallback option when Sekai Viewer is down.</p>
                </button>
                <button
                    className="btn-white btn-regular"
                    onClick={() => {
                        setShow(false);
                    }}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default AddModelSelect;
