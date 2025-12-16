import {useTranslation} from "react-i18next";

const LanguageSelect = (props) => {
    const [translate, i18n] = useTranslation("global");

    const changeLanguage = (lang) => {
        props.setLanguage(lang)
        i18n.changeLanguage(lang);
    };

    return (
        <select value={props.language} onChange={e => changeLanguage(e.target.value)}>
            <option value="pl">Polski</option>
            <option value="en">English</option>
        </select>
    );
}

export default LanguageSelect