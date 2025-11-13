import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {validateEmail, validateName, validatePassword} from "../../Utils";
import Warning from "../Warning";
import {useTranslation} from "react-i18next";

const ProfileEdit = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    useEffect(() => {
        if (props.user.id === undefined)
            navigate("/login");
    }, []);

    const [user] = useState(props.user);
    const [warning, setWarning] = useState('');
    const [passWarning, setPassWarning] = useState('');

    const editUserData = async () => {
        if (!validateName(user.User.name)) {
            setWarning(translate("incorrect_name"));
            return;
        }

        if (!validateEmail(user.User.email)) {
            setWarning(translate("incorrect_email"));
            return;
        }

        const customers = await fetch("http://localhost:3001/getClients")
            .then(res => res.json())
            .then(data => data.filter(u => u.id !== user.id))

        for (const c of customers) {
            if (c.User.name === user.User.name) {
                setWarning(translate("name_taken"));
                return;
            }
            if (c.User.email === user.User.email) {
                setWarning(translate("email_taken"));
                return;
            }
        }

        fetch("http://localhost:3001/editProfile/" + props.user.User.id, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: user.User.name,
                email: user.User.email
            })
        })
            .catch(err => alert(translate("connection-error")));

        props.user.name=user.User.name;
        props.user.email=user.User.email;
        navigate("/profile");
    }

    const editPassword = () => {
        const current = document.getElementById("current-pass").value;
        const newPass = document.getElementById("new-pass").value;
        const rePass = document.getElementById("re-pass").value;

        if (current !== user.User.password) {
            setPassWarning(translate("incorrect_password"));
            return;
        }

        if (!validatePassword(newPass)) {
            setPassWarning(translate("password_invalid"))
            return;
        }

        if (newPass !== rePass) {
            setPassWarning(translate("password_not_identical"));
            return;
        }

        fetch('http://localhost:3001/changePassword/' + props.user.User.id, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({password: newPass})
        })
            .catch(err => alert(translate("connection_error")))

        props.user.password = newPass;
        navigate("/profile");
    }

    return (
        <div className="center container">
            <h1>{translate("edit_profile")}</h1>
            <div className="form">
                <input type="text" placeholder={translate("name")} defaultValue={user.User.name} onChange={e => user.User.name = e.target.value}/><br/>
                <input type="email" placeholder={translate("e-mail")} defaultValue={user.User.email} onChange={e => user.User.email = e.target.value}/><br/>
                <button onClick={editUserData}>akceptuj</button>
                <Warning message={warning}/>
            </div>
            <h2>{translate("change_password")}</h2>
            <div className="form">
                <input id="current-pass" type="password" placeholder={translate("current_password")}/><br/>
                <input id="new-pass" type="password" placeholder={translate("new_password")}/><br/>
                <input id="re-pass" type="password" placeholder={translate("repeat_password")}/><br/>
                <button onClick={editPassword}>akceptuj</button>
                <Warning message={passWarning}/>
            </div>
        </div>
    );
}

export default ProfileEdit;