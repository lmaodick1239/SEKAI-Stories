import i18n from "i18next";
import en from "../locale/en-US.json";
import pl from "../locale/pl-PL.json";
import cn from "../locale/zh-CN.json";
import es from "../locale/es-ES.json";
import fil from "../locale/fil-PH.json"

const i18nInit = () => {
    i18n.init({
        interpolation: { escapeValue: false },
        lng: "en",
        resources: {
            en: { translation: en },
            pl: { translation: pl },
            cn: { translation: cn },
            es: { translation: es },
            fil: { translation: fil },
        },
        fallbackLng: "en",
    });

    const language = localStorage.getItem("language");
    i18n.changeLanguage(language ? language : "en");
};

export default i18nInit;
