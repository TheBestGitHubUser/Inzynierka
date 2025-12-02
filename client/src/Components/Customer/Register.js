import {useState} from "react";
import {useNavigate} from "react-router-dom";
import Warning from "../Warning";
import {validateEmail, validateGender, validateName, validatePassword} from "../../Utils";
import {useTranslation} from "react-i18next";

const Register = () => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    const [customer, setCustomer] = useState({
        name: "",
        email: "",
        password: "",
        rePass: "",
        birthDate: "",
        gender: "",
    });
    const [warning, setWarning] = useState("");

    const register = async () => {
        customer.name = customer.name.trim();
        customer.email = customer.email.trim().toLowerCase();
        customer.password = customer.password.trim();
        customer.rePass = customer.rePass.trim();
        customer.birthDate = customer.birthDate.trim();
        customer.gender = customer.gender.trim();

        if (customer.name.length === 0 || customer.email.length === 0 || customer.password.length === 0 || customer.rePass.length === 0) {
            setWarning(translate("require_all"));
            return;
        }

        if (!validateName(customer.name)) {
            setWarning(translate("incorrect_name"))
            return;
        }

        if (!validateEmail(customer.email)) {
            setWarning(translate("incorrect_email"))
            return;
        }

        if (!validatePassword(customer.password)) {
            setWarning(translate("password_invalid"))
            return;
        }

        if (customer.password !== customer.rePass) {
            setWarning(translate("password_not_identicals"));
            return;
        }
        if (!validateGender(customer.gender)){
            setWarning(translate("choose_gender"))
            return
        }

        const clients = await fetch("http://localhost:3001/getClients")
            .then(res => res.json())
            .then(data => data)

        for (const c of clients) {
            
            if (c.User.email === customer.email) {
                setWarning(translate("email_taken"));
                return;
            }
        }

        fetch("http://localhost:3001/putClient", {
            method: "PUT",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(customer)
        })
            .catch(err => alert(translate("operation_unsuccessful")));
        navigate("/login")
    }

    return (
        <div id="login-window" className="container">
            <h1>{translate("register_title")}</h1>
            <input id = "name" type="text" placeholder={translate("name")} onChange={e => customer.name = e.target.value}/><br/>
            <input id = "email" type="email" placeholder={translate("e-mail")} onChange={e => customer.email = e.target.value}/><br/>
            <input id = "password" type="password" placeholder={translate("password")} onChange={e => customer.password = e.target.value}/><br/>
            <input id = "re-password" type="password" placeholder={translate("repeat_password")} onChange={e => customer.rePass = e.target.value}/><br/>
            <input id = "birthdate" type="date" onChange={e => customer.birthDate = e.target.value}></input>
            <select type="text" id="selectGender" onChange={
                e => {var d = document.getElementById("selectGender")
                var value = d.value
                customer.gender = value
            }
            } required>
                <option value="" selected disabled hidden>{translate("choose_gender")}</option>
                <option value="M">{translate("male")}</option>
                <option value="F">{translate("female")}</option>
            </select><br/>
            <button onClick={() => register()}>{translate("register")}</button>
            <Warning message={warning}/>
        </div>
    );
}

export default Register;