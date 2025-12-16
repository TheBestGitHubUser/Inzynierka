import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {validateEmail, validateName, validatePassword} from "../../Utils";
import Warning from "../Warning";
import {useTranslation} from "react-i18next";
import { GENDERS } from "../Constans";

const ClientEdit = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    
    const [user, setUser] = useState({
        id: '',
        userID: '',
        email: '',
        name: '',
        birthDate: '',
        gender: '',
    });
    const {clientID} = useParams()
    const [warning, setWarning] = useState('');
    const [detailsWarning, setDetailsWarning] = useState('');
    const [passWarning, setPassWarning] = useState('');

    useEffect(() => {
        fetch("http://localhost:3001/getClient/" + clientID, {
            headers: { Authorization: "Bearer " + localStorage.getItem('token') },
    })
      .then(res => res.json())
      .then(data => {
            setUser({
            id: data.id,
            userID: data.userID,
            email: data.User.email,
            name: data.User.name,
            birthDate: data.birthDate,
            gender:data.gender,
          });
      })
      .catch(translate("connection_error"))
    }, []);

    const editUserData = async () => {
        if (!validateName(user.name)) {
            setWarning(translate("incorrect_name"));
            return;
        }

        if (!validateEmail(user.email)) {
            setWarning(translate("incorrect_email"));
            return;
        }

        const customers = await fetch("http://localhost:3001/getDevelopers")
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
            const res = await fetch("http://localhost:3001/editProfile/" + user.userID, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: user.name,
                email: user.email
            })
        })

            if (res.ok) { 
                navigate(-1);
            } else { 
                setWarning(translate("unknown_error"));
            }

            

        }catch (err){
            setWarning(translate("connection_error"));
        }
    }

    const editClientData = async () => {
        if (user.birthDate.length <=0) {
            setDetailsWarning(translate("negative salary"));
            return;
        }

        if (user.gender.length <=0) {
            setDetailsWarning(translate("chose_a_role"));
            return;
        }
        try{
            const res = await fetch("http://localhost:3001/postClient", {
            method: "POST",
            headers: {'Content-Type': 'application/json',
                    'Authorization': "Bearer " + localStorage.getItem("token") },
            body: JSON.stringify({
                id: user.id,
                birthDate: user.birthDate,
                gender: user.gender,
            })
        })

            if (res.ok) { 
                navigate(-1);
            } else { 
                setDetailsWarning(translate("unknown_error"));
            }

            

        }catch (err){
            setDetailsWarning(translate("connection_error"));
        }
    }

    const editPassword = async () => {
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
            const res = await fetch('http://localhost:3001/adminChangePassword/' + user.userID, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    newPassword: newPass})
            })

            if(res.ok){
                navigate(-1);
            }else{
                setPassWarning(translate("error"));
            }

        }catch(err){
            setPassWarning(translate("connection_error"));
        }
    }

    return (
        <div className="center container">
            <h1>{translate("edit_client")}</h1>
            <div className="form">
                <input type="text" placeholder={translate("name")} defaultValue={user.name} onChange={e => user.name = e.target.value}/><br/>
                <input type="email" placeholder={translate("e-mail")} defaultValue={user.email} onChange={e => user.email = e.target.value}/><br/>
                <button onClick={editUserData}>akceptuj</button>
                <Warning message={warning}/>
            </div>

        
            <h1>{translate("edit_details")}</h1>
            <div className="form">
                <select
                id="selectGender"
                value={user.gender}
                onChange={(e) => setUser({...user,gender: e.target.value})}
                required
            >
                {GENDERS.map((option)=>
                    <option value={option.value}>
                        {translate(option.label)}
                    </option>
                )}
                
                 </select><br/>
                <input type="date" placeholder={translate("birthDate")} defaultValue={user.birthDate ? new Date(user.birthDate).toISOString().split("T")[0]: ""} onChange={e => user.birthDate = e.target.value}/><br/>
                <button onClick={editClientData}>akceptuj</button>
                <Warning message={detailsWarning}/>
            </div>

            <h2>{translate("change_password")}</h2>
            <div className="form">
                <input id="new-pass" type="password" placeholder={translate("new_password")}/><br/>
                <input id="re-pass" type="password" placeholder={translate("repeat_password")}/><br/>
                <button onClick={editPassword}>akceptuj</button>
                <Warning message={passWarning}/>
            </div>
        </div>
    );
}

export default ClientEdit;