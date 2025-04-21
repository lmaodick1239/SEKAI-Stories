import React, { useEffect, useState } from "react";

const randomText = [
    "Nene is playing maimai. The map is Tsunagite.",
    "Rui with his ThinkPad laptop.",
    "Tsukasa is laughing in the hallway like a kid again.",
    "Emu breaks the fourth wall, staring at you and says \"Wonderhoy!\"",
    "Ichika is fangirling over Miku. Again.",
    "Saki. Saki on fire?",
    "Honami and her thousand apple pies.",
    "Shiho is forming a new band with her little Phennies.",
    "Shizuku is lost again together with Karin Asaka.",
    "In a parallel universe, where Minori is the leader of ASRUN.",
    "Haruka becomes the wife of Minori.",
    "Airi lost her fang.",
    "Setsuna has been mistakenly called Kanade for the 1888th time.",
    "Mizuki is programming her countdown website for そこに在る、光。",
    "Mafuyu scares Emu to make her stop breaking the fourth wall.",
    "Ena threw a large basin at Akito.",
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
    "My Vercel Bandwidth blew up after I announced this application.",
    "MinoHaru is canon.",
    "AnHane is canon.",
    "Won won!?",
    "WONDERHOY!",
    "Lovely, Fairy, Momoi Airi!",
    "Untitled.",
];

const FlavorText: React.FC = () => {
    const [text, setText] = useState<string>("");

    useEffect(() => {
        setText(randomText[Math.floor(Math.random() * randomText.length)]);
    }, []);
    return (
        <div className="absolute bottom" id="flavor-text">
            {text}
        </div>
    );
};

export default FlavorText;
