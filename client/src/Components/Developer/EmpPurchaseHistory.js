import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {PurchaseSortOptions, sortPurchases} from "../PurchaseSortOptions";
import {useTranslation} from "react-i18next";

const EmpPurchaseHistory = () => {
    const {customerId} = useParams();
    const [translate, i18n] = useTranslation("global");
    const [purchases, setPurchases] = useState([]);
    const [sortOpt, setSortOpt] = useState(0);

    useEffect(() => {
        fetch("http://localhost:3001/user_purchases/" + customerId)
            .then(res => res.json())
            .then(data => setPurchases(data.sort((p1,p2) => sortPurchases(p1,p2,sortOpt))));
    }, [sortOpt]);

    const deletePurchase = (purchaseId) => {
        if (window.confirm(translate("purchase_delete_confirm")) === true) {
            fetch("http://localhost:3001/purchase/" + purchaseId, {method: "DELETE"})
                .catch(err => alert(translate("operation_unsuccessful")));
        }
    }

    const purchaseList = purchases.map((purchase) => {
        return (
            <tbody key={purchase.key}>
            <tr>
                <td>{purchase.id}</td>
                <td>{purchase.name}</td>
                <td>{purchase.purchase_price}</td>
                <td>{purchase.date + " " + purchase.time}</td>
                <td>{purchase.category}</td>
                <td><Link to={"/emp/purchases/" + purchase.id}>{translate("details")}</Link></td>
                <td><a onClick={() => deletePurchase(purchase.id)} className="underlined">{translate("delete")}</a></td>
            </tr>
            </tbody>
        );
    })

    return (
        <>
            <h3>{translate("user_purchases")}</h3>
            <PurchaseSortOptions setSortOpt={setSortOpt}/>
            <table>
                <thead>
                <tr>
                    <th>id</th>
                    <th>{translate("name")}</th>
                    <th>{translate("price")}</th>
                    <th>{translate("purchase_time")}</th>
                    <th>{translate("type")}</th>
                    <th>{translate("details")}</th>
                    <th>{translate("delete")}</th>
                </tr>
                </thead>
                {purchaseList}
            </table>
        </>
    )
}

export default EmpPurchaseHistory;