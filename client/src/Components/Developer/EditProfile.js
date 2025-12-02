import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {validateEmail, validateName, validatePassword} from "../../Utils";
import Warning from "../Warning";
import {useTranslation} from "react-i18next";

const EditProfile = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    const {developerID} = useParams()
    
    const [user, setUser] = useState({
        id: '',
        userID: '',
        email: '',
        name: '',
        role: '',
        salary: ''
    });
    const [warning, setWarning] = useState('');
    const [detailsWarning, setDetailsWarning] = useState('');
    const [passWarning, setPassWarning] = useState('');

    useEffect(() => {
        fetch("http://localhost:3001/getDeveloper/" + developerID, {
            headers: { Authorization: "Bearer " + localStorage.getItem('token') },
    })
      .then(res => res.json())
      .then(data => {
            setUser({
            id: data.id,
            userID: data.userID,
            email: data.User.email,
            name: data.User.name,
            role: data.role,
            salary: data.salary
          });
      })
      .catch(translate("connection_error"))
        if (!localStorage.getItem('token'))
            navigate("/brandLogin");
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
                navigate("/emp/employees");
            } else { 
                setWarning(translate("unknown_error"));
            }

            

        }catch (err){
            setWarning(translate("connection_error"));
        }
    }

    const editDevData = async () => {
        if (user.salary <=0) {
            setDetailsWarning(translate("negative salary"));
            return;
        }

        if (user.role.length <=0) {
            setDetailsWarning(translate("chose_a_role"));
            return;
        }
        try{
            const res = await fetch("http://localhost:3001/postDeveloper", {
            method: "POST",
            headers: {'Content-Type': 'application/json',
                    'Authorization': "Bearer " + localStorage.getItem("token") },
            body: JSON.stringify({
                id: user.id,
                salary: user.salary,
                role: user.role,
            })
        })

            if (res.ok) { 
                navigate("/emp/employees");
            } else { 
                setDetailsWarning(translate("unknown_error"));
            }

            

        }catch (err){
            setDetailsWarning(translate("connection_error"));
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
            const res = await fetch('http://localhost:3001/changePassword/' + user.userID, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    password: current,
                    newPassword: newPass})
            })

            if(res.ok){
                navigate("/emp/employees");
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

            <h1>{translate("edit_details")}</h1>
            <div className="form">
                <select
                id="selectRole"
                value={user.role}
                onChange={(e) => setUser({...user,role: e.target.value})}
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
                 </select><br/>
                <input type="text" placeholder={translate("salary")} defaultValue={user.salary} onChange={e => user.salary = e.target.value}/><br/>
                <button onClick={editDevData}>akceptuj</button>
                <Warning message={detailsWarning}/>
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

export default EditProfile;