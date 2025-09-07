import { t } from "i18next";
import React from "react";

interface Live2DIssueProps {
    costume: string;
}

const costumeIssueList: string[] = [
    "v2_19ena",
    "02saki_cloth001",
    "21miku_wonder",
    "16rui_cloth001",
];

const costumeCorruptedList: string[] = ["20mizuki_culture"];

const Live2DIssue: React.FC<Live2DIssueProps> = ({ costume }) => {
    const hasIssue = costumeIssueList.some((pattern) =>
        new RegExp(pattern, "i").test(costume)
    );
    const isCorrupted = costumeCorruptedList.some((pattern) =>
        new RegExp(`^${pattern}$`).test(costume)
    );

    return (
        <>
            {hasIssue && (
                <div>
                    <p>
                        <i className="bi bi-exclamation-circle-fill blue" />{" "}
                        {t("model.live2d-issue")}
                    </p>
                    <a
                        href="https://github.com/lezzthanthree/SEKAI-Stories/issues/20"
                        target="_blank"
                    >
                        <p>{t("model.live2d-issue-github")}</p>
                    </a>
                </div>
            )}
            {isCorrupted && (
                <div>
                    <p>
                        <i className="bi bi-exclamation-circle-fill blue" />{" "}
                        This costume is corrupted or unfinished work from the
                        source.
                    </p>
                </div>
            )}
        </>
    );
};

export default Live2DIssue;
