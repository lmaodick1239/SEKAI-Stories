import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import AdjustYPosition from "../../../AdjustYPosition";

const YOffset: React.FC = () => {
    const { t } = useTranslation();

    const [showAdjust, setShowAdjust] = useState<boolean>(false);
    return (
        <>

            <button
                className="btn-regular btn-100 btn-blue"
                onClick={() => {
                    setShowAdjust(true);
                }}
                >
                {t("adjust")}
            </button>
            {showAdjust && <AdjustYPosition show={setShowAdjust} />}
                <p>{t("text.y-offset-details")}</p>
        </>
    );
};

export default YOffset;
