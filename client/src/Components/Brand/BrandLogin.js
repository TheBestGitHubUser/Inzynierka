import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Warning from "../Warning";
import {useTranslation} from "react-i18next";

const BrandLogin = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    const [warning, setWarning] = useState('');

    const [brand] = useState({
        email: "",
        password: ""
    });

    if(localStorage.getItem("token")){
        navigate('/brand')
    }

    const checkLogin = () => {
        if (brand.email === "" || brand.email.trim().length === 0) {
            setWarning(translate("require-all"))
            return;
        }

        const promise = fetch("http://localhost:3001/brand", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
                body: JSON.stringify(brand)
        })
            .then(res => res.json())
            .then(data => {
                if (data.brand === undefined || data.token ===undefined ) {
                    setWarning(translate("incorrect_email_or_pass"))
                } else {
                    
                    props.setUser({
                        id: data.brand.id,
                        userID: data.brand.userID,
                        email: data.brand.User.email,
                        password: data.brand.User.password,
                        name: data.brand.User.name,
                        nip: data.brand.nipNumber
                        
                    })
                    localStorage.setItem("token", data.token);
                    navigate("/brand");
                }
            })
            .catch(err => alert(translate("operation_unsuccessful")));
    }

    return (
        <>
            <header>
                <img src="/logo.png" alt="logo" id="logo"/>
                <h1 className="inline">{translate("brand_platform")}</h1>
            </header>
            <div id="login-window" className="container">
                <h1>{translate("log_in_title")}</h1>
                <input type="email" id="email" placeholder={translate("e-mail")} onChange={e => brand.email = e.target.value}/><br/>
                <input type="password" id="password" placeholder={translate("password")} onChange={e => brand.password = e.target.value}/><br/>
                <button id = 'login' onClick={checkLogin}>{translate("login")}</button>
                <Warning message={warning}/><br/>

                <Link id = 'register-link' to={"/brandregister"}>{translate("register")}</Link>
            </div>
        </>
    );
}

export default BrandLogin;