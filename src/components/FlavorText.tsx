import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const randomText = {
    en: [
        "Can you hear the ominous bells tolling?",
        // "Nene is playing maimai. The map is Tsunagite.",
        // "Rui with his ThinkPad laptop.",
        // "Tsukasa is laughing in the hallway like a kid again.",
        // 'Emu breaks the fourth wall, staring at you and says "Wonderhoy!"',
        // "Ichika is fangirling over Miku. Again.",
        // "Saki. Saki on fire?",
        // "Honami and her thousand apple pies.",
        // "Shiho is forming a new band with her little Phennies.",
        // "Shizuku is lost again together with Karin Asaka.",
        // "In a parallel universe, where Minori is the leader of ASRUN.",
        // "Haruka becomes the wife of Minori.",
        // "Airi lost her fang.",
        // "Setsuna has been mistakenly called Kanade for the 1888th time.",
        // "Mizuki is 18 kilometers away from your house.",
        // "Mafuyu scares Emu to make her stop breaking the fourth wall.",
        // "Ena threw a large basin at Akito.",
        // "Ena fights against AI Art.",
        // "Toya is enjoying Tsukasa's loud laugh.",
        // "Kohane has been bitten by her pet snake.",
        // "An woke up and started speaking in English.",
        // "ABSOLUTE CINEMA",
        // "The Disapperance of Hatsune Miku",
        // "Listening to Forward (Synthion Remix)",
        // "Do not overdose yourself with shipping~",
        // "Please take only the recommended shipping dosage.",
        // "Just Monika.",
        // "What if Movie Miku appeared on my screen all of the sudden?",
        // "私は雨。(turns into ame-chan)",
        // "MinoHaru is canon.",
        // "AnHane is canon.",
        // "Won won!?",
        // "WONDERHOY!",
        // "Lovely, Fairy, Momoi Airi!",
        // "恋をして",
        // "Meet SEKAI Stories's cousin, SIFAS Dialogue Sandbox!",
        // "Untitled.",
    ],
    zh: [
        "宁宁在玩乌蒙地插，铺面是系ぎて",
        "类带着他的Thinkpad笔电",
        "怪人一二的司君又双叒叕在神高走廊大笑了",
        "笑梦酱打破了第四面墙，对着你说：“旺大吼！！！”",
        "一歌依然是第一Miku推",
        "Saki酱发烧了",
        "有一个人带着超多的苹果派走了，会是谁呢？好难猜啊",
        "Shiho又和蕾欧妮的几人吵架了，想组建一个新乐队",
        "szk在十字路口迷路了！豆腐人们快扣1帮她找到路吧！x",
        "在平行宇宙里，实乃理是ASRUN的人",
        "啊啊啊啊！！！！翻译真的难！！！",
        "爱莉失去了偶像工作",
        "setsuna已经被叫成knd1888次了",
        "MZK已经离TA家18千米远了，据说是ena追的（糖5还在追）",
        "Mafuyu吓唬Emu，让她停止打破第四堵墙（联系上下文）",
        "东云姐弟打起来了！",
        "ena姐：杜绝AIGC从你我做起",
        "toya和tks在看舞台剧",
        "心羽被她的宠物蛇咬伤了",
        "an早上起床就开始练习英语，让我们为她的好学点赞（）",
        "电影 -Akito箱后曲",
        "初音未来的消失 -高难易度谱面",
        "你能听到tks的叫声吗？",
        "携带恋话",
        "不要铺张浪费哦！",
        "你知道吗？中文汉化者SteveLF是个25推",
        "莫妮卡来了（心惊肉跳文学部）",
        "如果初音未来突然出现在我的屏幕上怎么办？（这是PJSK电影的剧情，好奇的可以去看看电影，大陆没上映）",
        "我是雨！",
        "ena：愛して！　愛して！　愛して！　もっともっと！！！（ena姐在25电台#38的solo）",
        "我们赢了吗？",
        "旺大吼！！",
        "L！O！V！E！mnr！",
        "恋をして",
        "来看看作者的偶像梦幻祭剧情生成器吧！",
        "Untitled.",
        "我绘我名",
    ],
    zhTW: ["寧寧在打mai，鋪面是系ぎて",
        "類帶著他的Thinkpad筆電",
        "怪人一二的司君又雙叒叕在神高走廊大笑了",
        '笑夢醬打破了第四面牆，對著你說：“旺大吼！！！”',
        "一歌依然是第一Miku推",
        "Saki醬發燒了",
        "有一個人帶著超多的蘋果派走了，會是誰呢？好難猜啊",
        "Shiho又和蕾歐妮的幾人吵架了，想組建一個新樂隊",
        "szk在十字路口迷路了！豆腐人們快扣1幫她找到路吧！x",
        "在平行宇宙裡，實乃理是ASRUN的人",
        "辛苦了前人",
        "愛莉失去了偶像工作",
        "setsuna已經被叫成knd1888次了",
        "mzk已經離她家18公里遠了，據說ena在追",
        "Mafuyu嚇唬Emu，讓她停止打破第四堵牆",
        "東雲姐弟打起來了！",
        "誒那姐：杜絕AI繪圖從你我做起",
        "toya和tks在看舞臺劇",
        "心羽被她的寵物蛇咬傷了",
        "an早上起床就開始練習英語，讓我們為她的好學點贊（）",
        "初音未來的消失 - 高難度譜面",
        "你能聽到tks的叫聲嗎？",
        "攜帶戀話",
        "你知道嗎？簡體中文漢化者SteveLF是個25推",
        "只有莫妮卡。",
        "如果初音未來突然出現在我的螢幕上怎麼辦？",
        "我是雨！",
        "我們贏了嗎？",
        "旺大吼！！",
        "L！O！V！E！MINORI！",
        "戀をして",
        "來看看作者的偶像夢幻祭劇情生成器吧！",
        "無題.",
        "我繪我名",
        "你能聽到那令人不安的鐘聲嗎？",
    ]
};

const FlavorText: React.FC = () => {
    const [text, setText] = useState<string>("");
    const { i18n } = useTranslation();
    const lng = i18n.language as keyof typeof randomText;
    const daysLeft = Math.ceil(
        (new Date("October 11, 2025 22:00:00 UTC").getTime() -
            new Date().getTime()) /
            (1000 * 60 * 60 * 24)
    );

    randomText.en.push(
        `About ${daysLeft < 0 ? 0 : daysLeft} ${
            daysLeft === 1 ? "day remains" : "days remain"
        }...`
    );
    randomText.zh.push(
        `尚余 ${daysLeft < 0 ? 0 : daysLeft} 天...`
    );
    randomText.zhTW.push(
        `尚餘 ${daysLeft < 0 ? 0 : daysLeft} 天...`
    );
    
    const quote =
        daysLeft < 0
            ? "...gomen..."
            : `${daysLeft} ${daysLeft === 1 ? "day remains" : "days remain"}.`;
    randomText.en.push(quote);

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
