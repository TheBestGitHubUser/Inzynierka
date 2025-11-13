import {useState} from "react";
import {useNavigate} from "react-router-dom";
import Warning from "../Warning";
import {validateEmail, validateGender, validateName, validatePassword} from "../../Utils";
import {useTranslation} from "react-i18next";

const Register = () => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    const [brand, setBrand] = useState({
        name: "",
        email: "",
        password: "",
        rePass: "",
        nipNumber: "",
    });
    const [warning, setWarning] = useState("");

    const register = async () => {
        brand.name = brand.name.trim();
        brand.email = brand.email.trim().toLowerCase();
        brand.password = brand.password.trim();
        brand.rePass = brand.rePass.trim();
        brand.nipNumber = brand.nipNumber.trim();

        if (brand.name.length === 0 || brand.email.length === 0 || brand.password.length === 0 || brand.rePass.length === 0
            || brand.nipNumber.length === 0
        ) {
            setWarning(translate("require_all"));
            return;
        }

        if (!validateName(brand.name)) {
            setWarning(translate("incorrect_name"))
            return;
        }

        if (!validateEmail(brand.email)) {
            setWarning(translate("incorrect_email"))
            return;
        }

        if (!validatePassword(brand.password)) {
            setWarning(translate("password_invalid"))
            return;
        }

        const brands = await fetch("http://localhost:3001/getBrands")
            .then(res => res.json())
            .then(data => data)

        for (const b of brands) {
            
            if (b.User.email === brand.email) {
                setWarning(translate("email_taken"));
                return;
            }
        }

        fetch("http://localhost:3001/putBrand", {
            method: "PUT",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(brand)
        })
            .catch(err => alert(translate("operation_unsuccessful")));
        navigate("/brandLogin")
    }

    return (
        <div id="login-window" className="container">
            <h1>{translate("register_title")}</h1>
            <input type="text" placeholder={translate("name")} onChange={e => brand.name = e.target.value}/><br/>
            <input type="email" placeholder={translate("e-mail")} onChange={e => brand.email = e.target.value}/><br/>
            <input type="password" placeholder={translate("password")} onChange={e => brand.password = e.target.value}/><br/>
            <input type="password" placeholder={translate("repeat_password")} onChange={e => brand.rePass = e.target.value}/><br/>
            <input type="text" placeholder={translate("nip_number")} onChange={e => brand.nipNumber = e.target.value}></input><br/>
            <button onClick={() => register()}>{translate("register")}</button>
            <Warning message={warning}/>
        </div>
    );
}

export default Register;