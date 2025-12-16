import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {validateEmail, validateName, validatePassword} from "../../Utils";
import Warning from "../Warning";
import {useTranslation} from "react-i18next";
import { ROLES } from "../Constans";

const BrandEdit = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    
    const [user, setUser] = useState({
        id: '',
        userID: '',
        email: '',
        name: '',
        role: '',
        salary: ''
    });
    const {brandID} = useParams()
    const [warning, setWarning] = useState('');
    const [detailsWarning, setDetailsWarning] = useState('');
    const [passWarning, setPassWarning] = useState('');

    useEffect(() => {
        fetch("http://localhost:3001/getBrand/" + brandID, {
            headers: { Authorization: "Bearer " + localStorage.getItem('token') },
    })
      .then(res => res.json())
      .then(data => {
            setUser({
            id: data.id,
            userID: data.userID,
            email: data.User.email,
            name: data.User.name,
            nipNumber: data.nipNumber
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

    const editBrandData = async () => {
        if (user.nipNumber.length <=0) {
            setDetailsWarning(translate("negative salary"));
            return;
        }
        try{
            const res = await fetch("http://localhost:3001/postBrand", {
            method: "POST",
            headers: {'Content-Type': 'application/json',
                    'Authorization': "Bearer " + localStorage.getItem("token") },
            body: JSON.stringify({
                id: user.id,
                nipNumber: user.nipNumber
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
            <h1>{translate("edit_brand")}</h1>
            <div className="form">
                <input type="text" placeholder={translate("name")} defaultValue={user.name} onChange={e => user.name = e.target.value}/><br/>
                <input type="email" placeholder={translate("e-mail")} defaultValue={user.email} onChange={e => user.email = e.target.value}/><br/>
                <button onClick={editUserData}>akceptuj</button>
                <Warning message={warning}/>
            </div>

        
            <h1>{translate("edit_details")}</h1>
            <div className="form">
                <input type="text" placeholder={translate("nip")} defaultValue={user.nipNumber} onChange={e => user.nipNumber = e.target.value}/><br/>
                <button onClick={editBrandData}>akceptuj</button>
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

export default BrandEdit;