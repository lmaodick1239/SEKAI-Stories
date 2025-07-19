import React from "react";

interface TranslatorsProps {
    lng: string;
}

const Translators: React.FC<TranslatorsProps> = ({ lng }) => {
    return (
        <div className="window__divider">
            {lng != "en" && (
                <div className="window__divider flex flex-row items-center gap-10">
                    <p>Translators: </p>
                    {lng == "es" && (
                        <>
                            <a
                                href="https://www.youtube.com/@GatoMagoMusic"
                                target="_blank"
                                className="translators"
                            >
                                <img src="https://yt3.googleusercontent.com/bXEX1lrt2hFwcGYSGUuWDDYSd2VtHMJ-_-FnJMWzVRjcpQZMlpYeWe7MSCI9kszUAbydBSN5=s120-c-k-c0x00ffffff-no-rj" />
                            </a>
                        </>
                    )}
                    {lng == "zh" && (
                        <>
                            <a
                                href="https://github.com/MiddleRed"
                                target="_blank"
                                className="translators"
                            >
                                <img src="https://avatars.githubusercontent.com/u/98752512?v=4" />
                            </a>
                            <a
                                href="https://github.com/SteveLF-bili"
                                target="_blank"
                                className="translators"
                            >
                                <img src="https://avatars.githubusercontent.com/u/182323592?v=4" />
                            </a>
                        </>
                    )}
                    {lng == "fil" && (
                        <>
                            <a
                                href="https://github.com/lezzthanthree"
                                target="_blank"
                                className="translators"
                            >
                                <img src="https://avatars.githubusercontent.com/u/63889032?v=4" />
                            </a>
                        </>
                    )}
                    {lng == "pl" && (
                        <>
                            <a
                                href="https://github.com/counter185"
                                target="_blank"
                                className="translators"
                            >
                                <img src="https://avatars.githubusercontent.com/u/33550839?v=4" />
                            </a>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Translators;
