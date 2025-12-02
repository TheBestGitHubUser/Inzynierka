import {useState} from "react";
import {useNavigate} from "react-router-dom";
import Warning from "../Warning";
import {useTranslation} from "react-i18next";

const EmpLogin = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    const [warning, setWarning] = useState('');

    const [employee] = useState({
        email: null,
        password: null
    });

    const checkLogin = () => {
        if (employee.email === null || employee.email.trim().length === 0) {
            setWarning(translate("require-all"))
            return;
        }

        fetch("http://localhost:3001/developer/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
                body: JSON.stringify(employee)
        })
            .then(res => res.json())
            .then(data => {
                if (data.dev === undefined || data.token ===undefined) {
                    setWarning(translate("incorrect_email_or_pass"))
                } else {
                    localStorage.setItem("token", data.token);
                    props.setUser({
                        id: data.dev.id,
                        userID: data.dev.userID,
                        email: data.dev.User.email,
                        name: data.dev.User.name,
                        role: data.dev.role,
                        salary: data.dev.salary
                        
                    })
                    navigate("/emp");
                }
            })
            .catch(err => alert(translate("operation_unsuccessful")));
    }

    return (
        <>
            <header>
                <img src="/logo.png" alt="logo" id="logo"/>
                <h1 className="inline">{translate("employee_platform")}</h1>
            </header>
            <div id="login-window" className="container">
                <h1>{translate("log_in_title")}</h1>
                <input type="email" id="email" placeholder={translate("e-mail")} onChange={e => employee.email = e.target.value}/><br/>
                <input type="password" id="password" placeholder={translate("password")} onChange={e => employee.password = e.target.value}/><br/>
                <button onClick={checkLogin}>{translate("login")}</button>
                <Warning message={warning}/>
            </div>
        </>
    );
}

export default EmpLogin;