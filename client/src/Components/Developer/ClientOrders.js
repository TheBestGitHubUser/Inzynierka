import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {PurchaseSortOptions, sortPurchases} from "../PurchaseSortOptions";
import {useTranslation} from "react-i18next";

const ClientOrders = (props) => {
    const [translate, i18n] = useTranslation("global");
    const [purchases, setPurchases] = useState([]);
    const {clientID} = useParams();
    const [sortOpt, setSortOpt] = useState(0);

    useEffect(() => {
        fetch("http://localhost:3001/getClientOrders/" + clientID, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res =>{
                if (!res.ok) throw new Error("Unauthorized");
                    return res.json();
            })
            .then(data => setPurchases(data.sort((p1, p2) => sortPurchases(p1, p2, sortOpt))));
    }, [sortOpt]);

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

    const purchaseList = purchases.map((purchase) => {
        return (
            <tbody key={purchase.key}>
            <tr>
                <td>{purchase.Product?.name}</td>
                <td>{purchase.Product?.category}</td>
                <td>{purchase.price}</td>
                <td>{purchase.size}</td>
                <td>{purchase.status}</td>
                <td>{new Date(purchase.createdAt).toLocaleString()}</td>
                <td><a onClick={() => deleteOffer(purchase.id)} className="underlined">{translate("delete")}</a></td>
            </tr>
            </tbody>
        );
    })

    return (
        <>
        <div className="center container">
            <h3>{translate("user_purchases")}</h3>
            <PurchaseSortOptions setSortOpt={setSortOpt}/>
            <table>
                <thead>
                <tr>
                    <th>{translate("title")}</th>
                    <th>{translate("category")}</th>
                    <th>{translate("price")}</th>
                    <th>{translate("size")}</th>
                    <th>{translate("status")}</th>
                    <th>{translate("purchase_time")}</th>
                    <th>{translate("delete_order")}</th>
                </tr>
                </thead>
                {purchaseList}
            </table>
        </div>
        </>
    )
}

export default ClientOrders;