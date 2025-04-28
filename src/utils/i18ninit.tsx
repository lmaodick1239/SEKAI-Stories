import i18n from "i18next";
import en from "../locale/en-US.json";

const i18nInit = () => {
    i18n.init({
        interpolation: { escapeValue: false },
        lng: "en",
        resources: {
            en: { translation: en },
        },
    });

    const language = localStorage.getItem("language");
    i18n.changeLanguage(language ? language : "en");
};

export default i18nInit;
