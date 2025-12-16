import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import SearchBar from "../SearchBar";
import {useTranslation} from "react-i18next";

const Employees = (props) => {
    const [developers, setDevelopers] = useState([]);
    const [translate, i18n] = useTranslation("global");
    const [searched, setSearched] = useState('');
    const navigate = useNavigate()

    const getEmp = async () => {
        await fetch("http://localhost:3001/getDevelopers")
            .then(res => res.json())
            .then(data => {
                setDevelopers(data
                    .filter(o => o.User?.name.includes(searched))
                )
            })
            .catch(err => alert(translate("operation_unsuccessful")));
    }

   useEffect(() => {
            getEmp()
        }, [searched,developers]);

    const deleteDev = async (userID) => {
        if (window.confirm(translate("developer_delete_confirm")) === true) {
            const res = await fetch("http://localhost:3001/deleteUser/" + userID, {method: "DELETE"})
                    .catch(err => alert(translate("operation_unsuccessful")));
                if(res.ok){
                    getEmp()
                }
                

        }
    }
        

    const offerList = developers.map((developer) => {
        return (
            <tbody key={developer.id}>
            <tr>
                <th>{developer.id}</th>
                <td>{developer.User?.name}</td>
                <td>{developer.User?.email}</td>
                <td>{developer.role}</td>
                <td>{developer.salary}</td>
                <td><Link to={'edit/'+developer.id+""}>{translate("edit")}</Link> </td>
                <td>{developer.role==='admin'?'-': 
                    <a onClick={() => deleteDev(developer.User.id)} className="underlined">{translate("delete")}</a>} </td>
            </tr>
            </tbody>
        );
    });

    return (
        <div className="center container">
            <h1>{translate("employees")}</h1>
            <SearchBar setSearched={setSearched}/><br/>
            <Link id='new' to="new">{translate("add_employee")}</Link><br/>
            <table>
                <thead>
                <tr>
                    <th>id</th>
                    <th>{translate("name")}</th>
                    <th>{translate("email")}</th>
                    <th>{translate("role")}</th>
                    <th>{translate("salary")}</th>
                    <th>{translate("edit")}</th>
                    <th>{translate("delete")}</th>
                </tr>
                </thead>
                {offerList}
            </table>
        </div>
    );
};

export default Employees;