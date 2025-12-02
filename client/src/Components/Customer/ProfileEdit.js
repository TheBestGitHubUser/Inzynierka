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

        try{
            const res = await fetch("http://localhost:3001/editProfile/" + props.user.User.id, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: user.User.name,
                email: user.User.email
            })
        })

            if (res.ok) { 
                props.user.User.name=user.User.name;
                props.user.User.email=user.User.email;
                navigate("/profile");
            } else { 
                setWarning(translate("unknown_error"));
            }

            

        }catch (err){
            setWarning(translate("connection_error"));
        }
    }

    const editPassword = async () => {
        const current = document.getElementById("current-pass").value;
        const newPass = document.getElementById("new-pass").value;
        const rePass = document.getElementById("re-pass").value;

        if (!validatePassword(newPass)) {
            setPassWarning(translate("password_invalid"))
            return;
        }

        if (newPass !== rePass) {
            setPassWarning(translate("password_not_identical"));
            return;
        }

        try{
            const res = await fetch('http://localhost:3001/changePassword/' + props.user.User.id, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    password: current,
                    newPassword: newPass})
            })

            if(res.ok){
                navigate("/profile");
            }else{
                setPassWarning(translate("Wrong password"));
            }

        }catch(err){
            setPassWarning(translate("connection_error"));
        }

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