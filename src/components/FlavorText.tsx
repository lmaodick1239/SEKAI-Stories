import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const randomText = {
    en: [
        "Nene is playing maimai. The map is Tsunagite.",
        "Rui with his ThinkPad laptop.",
        "Tsukasa is laughing in the hallway like a kid again.",
        'Emu breaks the fourth wall, staring at you and says "Wonderhoy!"',
        "Ichika is fangirling over Miku. Again.",
        "Saki. Saki on fire?",
        "Honami and her thousand apple pies.",
        "Shiho is forming a new band with her little Phennies.",
        "Shizuku is lost again together with Karin Asaka.",
        "In a parallel universe, where Minori is the leader of ASRUN.",
        "Haruka becomes the wife of Minori.",
        "Airi lost her fang.",
        "Setsuna has been mistakenly called Kanade for the 1888th time.",
        "Mizuki is 18 kilometers away from your house.",
        "Mafuyu scares Emu to make her stop breaking the fourth wall.",
        "Ena threw a large basin at Akito.",
        "Ena fights against AI Art.",
        "Toya is enjoying Tsukasa's loud laugh.",
        "Kohane has been bitten by her pet snake.",
        "An woke up and started speaking in English.",
        "ABSOLUTE CINEMA",
        "The Disapperance of Hatsune Miku",
        "Can you hear the ominous bells tolling?",
        "Listening to Forward (Synthion Remix)",
        "Do not overdose yourself with shipping~",
        "Please take only the recommended shipping dosage.",
        "Just Monika.",
        "What if Movie Miku appeared on my screen all of the sudden?",
        "私は雨。(turns into ame-chan)",
        "MinoHaru is canon.",
        "AnHane is canon.",
        "Won won!?",
        "WONDERHOY!",
        "Lovely, Fairy, Momoi Airi!",
        "ユ！",
        "Meet SEKAI Stories's cousin, SIFAS Dialogue Sandbox!",
        "Untitled.",
    ],
};

const FlavorText: React.FC = () => {
    const [text, setText] = useState<string>("");
    const { i18n } = useTranslation();
    const lng = i18n.language as keyof typeof randomText;
    const daysLeft = Math.ceil(
        (new Date("October 13, 2025 04:00:00 UTC").getTime() -
            new Date().getTime()) /
            (1000 * 60 * 60 * 24)
    );

    randomText.en.push(
        `About ${daysLeft < 0 ? 0 : daysLeft} ${
            daysLeft === 1 ? "day remains" : "days remain"
        }...`
    );

    useEffect(() => {
        const languageRandomText = randomText[lng]
            ? [...randomText.en, ...randomText[lng]]
            : randomText.en;
        setText(
            languageRandomText[
                Math.floor(Math.random() * languageRandomText.length)
            ]
        );
    }, [lng]);
    return <p id="flavor-text">{text}</p>;
};

export default FlavorText;
