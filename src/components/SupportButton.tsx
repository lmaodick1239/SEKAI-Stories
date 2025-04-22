import React, { useState } from "react";

const SupportButton: React.FC = () => {
    const [show, setShow] = useState<boolean>(false);

    return (
        <div className="absolute top-left" id="support-button">
            <button
                className="btn-regular btn-orange"
                onClick={() => setShow(true)}
            >
                Support
            </button>
            {show && (
                <div
                    id="support-screen"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShow(false);
                    }}
                >
                    <div
                        className="window"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h1>Support</h1>
                        <p>
                            If you enjoy using SEKAI Stories, you can support me
                            through one of the following ways:
                        </p>
                        <h2>Ko-fi</h2>
                        <p>
                            Donations go directly toward funding the website! I
                            will also be posting the website updates there as
                            well.
                        </p>
                        <a href="https://ko-fi.com/smiliepop" target="_blank">
                            <img src="/img/kofi.jpg" alt="ko-fi" />
                        </a>
                        <h2>GitHub</h2>
                        <p>
                            This project is completely open-source! You can
                            report issues or open a pull request to contribute!
                        </p>
                        <a
                            href="https://github.com/lezzthanthree/SEKAI-Stories"
                            target="_blank"
                        >
                            <img src="/img/github.jpg" alt="ko-fi" />
                        </a>
                        <div className="extend-width center">
                            <button
                                className="btn-regular btn-white center"
                                onClick={() => setShow(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupportButton;
