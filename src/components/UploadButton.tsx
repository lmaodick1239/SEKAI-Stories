import { useRef, useState } from "react";
import Window from "./Window";

interface UploadImageButtonProps {
    id: string;
    uploadFunction: (file: File) => void;
    text: string | React.ReactNode;
    alertMsg?: string;
    type?: string;
}

const UploadImageButton: React.FC<UploadImageButtonProps> = ({
    id,
    uploadFunction,
    text,
    alertMsg,
    type = "button",
}) => {
    const uploadElement = useRef<HTMLInputElement | null>(null);
    const checkFile = (file: File) => {
        const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!validImageTypes.includes(file["type"])) {
            alert("This is not an image!");
            return false;
        }
        return true;
    };
    const [alertWindow, setAlertWindow] = useState(false);
    return (
        <>
            <input
                ref={uploadElement}
                type="file"
                id={id}
                style={{ display: "none" }}
                accept="image/*"
                onChange={async () => {
                    if (uploadElement.current && uploadElement.current.files) {
                        const file = uploadElement.current.files[0];
                        if (file && checkFile(file)) {
                            await uploadFunction(file);
                        }
                    }
                }}
            />
            <button
                id={`btn-${id}`}
                className={
                    type == "round"
                        ? "btn-circle btn-white"
                        : "btn-regular btn-white btn-extend-width"
                }
                onClick={async () => {
                    if (alertMsg) {
                        setAlertWindow(true);
                    } else if (uploadElement.current) {
                        uploadElement.current.click();
                    }
                }}
            >
                {text}
            </button>
            {alertWindow && (
                <Window
                    confirmFunction={() =>
                        uploadElement.current && uploadElement.current.click()
                    }
                    show={setAlertWindow}
                >
                    <div className="window__content">
                        <p>{alertMsg}</p>
                    </div>
                </Window>
            )}
        </>
    );
};

export default UploadImageButton;
