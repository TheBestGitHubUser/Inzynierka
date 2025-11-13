import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const SignedUp = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");

    return (
        <div className="center container">
            <h1>{translate("you_have_successfully_signed_up")}</h1>
            <button onClick={() => navigate("/tournament")}>{translate("back_to_events")}</button>
        </div>
    );
}

export default SignedUp;