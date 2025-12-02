import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import SearchBar from "../SearchBar";
import {useTranslation} from "react-i18next";

const Orders = (props) => {
    const [orders, setOrders] = useState([]);
    const [translate, i18n] = useTranslation("global");
    const [searched, setSearched] = useState('');

    useEffect(() => {
        fetch("http://localhost:3001/getBrandOrders/"+ props.user.id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setOrders(data
                    .filter(o => o.name.includes(searched))
                )
            })
            .catch(err => alert(translate("operation_unsuccessful")));
    }, [searched]);

    const deleteOffer = (orderID) => {
        if (window.confirm(translate("offer_delete_confirm")) === true) {
            fetch("http://localhost:3001/deleteOrder/" + orderID, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
            })
                .catch(err => alert(translate("operation_unsuccessful")));
        }
    }

    const offerList = orders.map((order) => {
        return (
            <tbody key={order.id}>
            <tr>
                <th>{order.id}</th>
                <td>{order.name}</td>
                <td>{order.surname}</td>
                <td>{order.size}</td>
                <td>{order.price}</td>
                <td>{order.address}</td>
                <td>{order.status}</td>
                <td>{order.Product.id}</td>
                <td>{order.Product.name}</td>
                <td><Link to={order.id+"/"}>{translate("edit")}</Link></td>
                <td><a onClick={() => deleteOffer(order.id)} className="underlined">{translate("delete")}</a></td>
            </tr>
            </tbody>
        );
    });

    return (
        <div className="center container">
            <h1>{translate("orders")}</h1>
            <SearchBar setSearched={setSearched}/><br/>
            <table>
                <thead>
                <tr>
                    <th>id</th>
                    <th>{translate("firstname")}</th>
                    <th>{translate("surname")}</th>
                    <th>{translate("size")}</th>
                    <th>{translate("price")}</th>
                    <th>{translate("address")}</th>
                    <th>{translate("status")}</th>
                    <th>{translate("product_id")}</th>
                    <th>{translate("product_name")}</th>
                    <th>{translate("edit")}</th>
                    <th>{translate("delete_order")}</th>
                </tr>
                </thead>
                {offerList}
            </table>
        </div>
    );
};

export default Orders;