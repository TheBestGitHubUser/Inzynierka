import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Warning from "../Warning";
import { validateEmail, validateName, validatePassword } from "../../Utils";
import { useTranslation } from "react-i18next";

const EmployeeEdit = () => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");

    const [developer, setDeveloper] = useState({
        userID: '',
        name: "",
        email: "",
        password: "",
        rePass: "",
        role: "",
        salary: "",
    });

    const [warning, setWarning] = useState("");

    const register = async () => {
        developer.name = developer.name.trim();
        developer.email = developer.email.trim().toLowerCase();
        developer.password = developer.password.trim();
        developer.rePass = developer.rePass.trim();
        developer.role = developer.role.trim();
        developer.salary = developer.salary.toString().trim();

        if (
            developer.name.length === 0 ||
            developer.email.length === 0 ||
            developer.password.length === 0 ||
            developer.rePass.length === 0 ||
            developer.role.length === 0 ||
            developer.salary.length === 0
        ) {
            setWarning(translate("require_all"));
            return;
        }

        if (!validateName(developer.name)) {
            setWarning(translate("incorrect_name"));
            return;
        }

        if (!validateEmail(developer.email)) {
            setWarning(translate("incorrect_email"));
            return;
        }

        if (!validatePassword(developer.password)) {
            setWarning(translate("password_invalid"));
            return;
        }

        if (developer.password !== developer.rePass) {
            setWarning(translate("password_not_identicals"));
            return;
        }

        if (isNaN(Number(developer.salary)) || Number(developer.salary) <= 0) {
            setWarning(translate("invalid_salary"));
            return;
        }

        
                const devs = await fetch("http://localhost:3001/getDevelopers")
                .then((res) => res.json())
                .catch(() => {
                    alert(translate("connection_error"));
                    return [];
                });

            for (const d of devs) {
                if (d.User.email === developer.email) {
                    setWarning(translate("email_taken"));
                    return;
                }
            }

            fetch("http://localhost:3001/putDeveloper", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(developer),
                    })
                        .then(() => navigate("/emp/employees"))
                        .catch(() => alert(translate("operation_unsuccessful")));
                
       
        navigate('/emp/employees')

        
    };

    return (
        <div id="login-window" className="container">
            <h1>{translate("register_dev_title")}</h1>
            <input
                type="text"
                id="name-input"
                defaultValue={developer.name}
                placeholder={translate("name")}
                onChange={(e) => (developer.name = e.target.value)}
            />
            <br />
            <input
                type="email"
                id="email-input"
                defaultValue={developer.email}
                placeholder={translate("e-mail")}
                onChange={(e) => (developer.email = e.target.value)}
            />
            <br />
            <input
                type="password"
                id="password-input"
                defaultValue={developer.password}
                placeholder={translate("password")}
                onChange={(e) => (developer.password = e.target.value)}
            />
            <br />
            <input
                type="password"
                id="re-password-input"
                defaultValue={developer.password}
                placeholder={translate("repeat_password")}
                onChange={(e) => (developer.rePass = e.target.value)}
            />
            <br />

            <select
                id="selectRole"
                value={developer.role}
                onChange={(e) => setDeveloper({...developer,role: e.target.value})}
                required
            >
                <option value="" selected disabled hidden>
                    {translate("choose_role")}
                </option>
                <option value="admin">Admin</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
            </select>
            <br />
            <input
                type="number"
                id="salary-input"
                defaultValue={developer.salary}
                placeholder={translate("salary")}
                onChange={(e) => (developer.salary = e.target.value)}
            />
            <br />

            <button onClick={() => register()}>{translate("register")}</button>
            <Warning message={warning} />
        </div>
    );
};

export default EmployeeEdit;