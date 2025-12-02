import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import Warning from "../Warning";
import {useTranslation} from "react-i18next";

const Login = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    const [warning, setWarning] = useState('');
    const [customer] = useState({
        email: null,
        password: null
    });

    if(localStorage.getItem("token")){
        navigate('/profile')
    }

    const checkLogin = async() => {
        if (customer.email === null || customer.email.trim().length === 0) {
            setWarning(translate("require_all"))
            return;
        }

        const promise = fetch("http://localhost:3001/client", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
                body: JSON.stringify(customer)
        })
            .then(res => res.json())
            .then(data => {
                if (data.user === undefined || data.token === undefined) {
                    setWarning(translate("incorrect_email_or_pass"));
                } else {
                    localStorage.setItem("token", data.token);
                    props.setUser(data.user)
                    navigate("/");
                }
            })
            .catch(err => alert(translate("connection_error")));
    }

    return (
        <div id="login-window" className="container">
            <h1>{translate("log_in_title")}</h1>
            <input type="email" id="email" placeholder={translate("e-mail")} onChange={e => customer.email = e.target.value}/><br/>
            <input type="password" id="password" placeholder={translate("password")} onChange={e => customer.password = e.target.value}/><br/>
            <button id="login" onClick={checkLogin}>{translate("login")}</button>
            <Warning message={warning}/><br/>
            <Link id="register-link" to={"/register"}>{translate("register")}</Link><br/>
            <Link id="brand-link" to={"/brandlogin"}>{translate("brand_platform")}</Link><br/>
            <Link id="developer-link" to={"/emplogin"}>{translate("employee_platform")}</Link>
        </div>
    );
}

export default Login;