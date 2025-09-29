import i18n from "i18next";
import en from "../locale/en-US.json";
import pl from "../locale/pl-PL.json";
import zh from "../locale/zh-CN.json";
import es from "../locale/es-ES.json";
import fil from "../locale/fil-PH.json";
import ms from '../locale/ms-MY.json';
import fr from '../locale/fr-FR.json';
import th from '../locale/th-TH.json';
import zhHK from '../locale/zh-HK.json';
import zhTW from '../locale/zh-TW.json';

export const languageNames = {
    en: "English",
    es: "Español",
    fr: "Français",
    zh: "简体中文",
    fil: "Filipino",
    ms: "Bahasa Melayu",
    th: "ไทย",
    pl: "Polski (incomplete)",
    zhTW: "繁體中文",
    zhHK: "港式粵語",
};

export const handleChangeLanguage = async (
    event: React.ChangeEvent<HTMLSelectElement>
) => {
    const languangeToChange = event.target.value;

    i18n.changeLanguage(languangeToChange);
    localStorage.setItem("language", languangeToChange);
};

const i18nInit = () => {
    i18n.init({
        interpolation: { escapeValue: false },
        lng: "en",
        resources: {
            en: { translation: en },
            pl: { translation: pl },
            zh: { translation: zh },
            es: { translation: es },
            fil: { translation: fil },
            ms: { translation: ms },
            fr: { translation: fr },
            th: { translation: th },
            zhTW: { translation: zhTW },
            zhHK: { translation: zhHK },
        },
        fallbackLng: "en",
    });

    const language = localStorage.getItem("language");
    i18n.changeLanguage(language ? language : "en");
};

export default i18nInit;