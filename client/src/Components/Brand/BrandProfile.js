import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {validateEmail, validateName, validatePassword} from "../../Utils";
import Warning from "../Warning";
import {useTranslation} from "react-i18next";

const BrandProfile = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    useEffect(() => {
        if (!localStorage.getItem('token'))
            navigate("/brandLogin");
    }, []);

    const [user] = useState(props.user);
    const [warning, setWarning] = useState('');
    const [passWarning, setPassWarning] = useState('');

    const editUserData = async () => {
        if (!validateName(user.name)) {
            setWarning(translate("incorrect_name"));
            return;
        }

        if (!validateEmail(user.email)) {
            setWarning(translate("incorrect_email"));
            return;
        }

        const customers = await fetch("http://localhost:3001/getBrands",
            {
                method: 'GET',
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
            }
        )
            .then(res => res.json())
            .then(data => data.filter(u => u.id !== user.id))

        for (const c of customers) {
            if (c.User.name === user.name) {
                setWarning(translate("name_taken"));
                return;
            }
            if (c.User.email === user.email) {
                setWarning(translate("email_taken"));
                return;
            }
        }

        try{
            const res = await fetch("http://localhost:3001/editProfile/" + props.user.userID, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: user.name,
                email: user.email
            })
        })

            if (res.ok) { 
                props.user.name=user.name;
                props.user.email=user.email;
                navigate("/brand");
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
            const res = await fetch('http://localhost:3001/changePassword/' + props.user.userID, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    password: current,
                    newPassword: newPass})
            })

            if(res.ok){
                navigate("/brand");
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
                <input type="text" placeholder={translate("name")} defaultValue={user.name} onChange={e => user.name = e.target.value}/><br/>
                <input type="email" placeholder={translate("e-mail")} defaultValue={user.email} onChange={e => user.email = e.target.value}/><br/>
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

export default BrandProfile;