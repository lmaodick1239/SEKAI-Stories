import React from "react";

const Crash: React.FC = () => {
    throw new Error("Can you hear the ominous bells tolling?");
    return (
        <div>
            <h1>This will be impossible to render.</h1>
        </div>
    );
};

export default Crash;
