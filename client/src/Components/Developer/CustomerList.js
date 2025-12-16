import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import SearchBar from "../SearchBar";
import {useTranslation} from "react-i18next";

const CustomerList = () => {
    const [translate, i18n] = useTranslation("global");
    const [customers, setCustomers] = useState([]);
    const [searched, setSearched] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
        fetch("http://localhost:3001/getClients",{
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setCustomers(data
                    .filter(c => c.User.name.includes(searched) || c.User.email.includes(searched) || c.id+''===searched)
                )
            });
    }, [searched,customers]);

    const deleteCustomer = (customerId) => {
        if (window.confirm(translate("user_delete_confirm")) === true) {
            fetch("http://localhost:3001/deleteUser/" + customerId, {method: "DELETE"})
        }
    }

    const customerList = customers.map(customer => {
        return (
            <tbody key={customer.id}>
            <tr>
                <th>{customer.id}</th>
                <td>{customer.User.name}</td>
                <td>{customer.User.email}</td>
                <td><Link to={"orders/"+customer.id}>{translate("orders")}</Link></td>
                <td><Link to={"participations/" + customer.id}>{translate("participations")}</Link></td>
                <td><Link to={"edit/" + customer.id}>{translate("edit")}</Link></td>
                <td><a onClick={() => deleteCustomer(customer.User.id)} className="underlined">{translate("delete")}</a></td>
            </tr>
            </tbody>
        );
    });

    return (
        <div className="center container">
            <h1>{translate("customers")}</h1>
            <SearchBar setSearched={setSearched}/><br/>
            <Link id="addClient" to="addClient">{translate("add_client")}</Link><br/>
            <table>
                <thead>
                <tr>
                    <th>id</th>
                    <th>{translate("name")}</th>
                    <th>{translate("e-mail")}</th>
                    <th>{translate("orders")}</th>
                    <th>{translate("participations")}</th>
                    <th>{translate("edit")}</th>
                    <th>{translate("delete")}</th>
                </tr>
                </thead>
                {customerList}
            </table>
        </div>
    );
}

export default CustomerList;