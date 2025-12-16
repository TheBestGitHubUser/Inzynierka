import {useEffect, useState} from "react";
import {json, Link} from "react-router-dom";
import {PurchaseSortOptions, sortPurchases} from "../PurchaseSortOptions";
import {useTranslation} from "react-i18next";

const PurchaseHistory = (props) => {
    const [translate, i18n] = useTranslation("global");
    const [purchases, setPurchases] = useState([]);
    const [sortOpt, setSortOpt] = useState(0);

    const getPurchases = ()=>{
        fetch("http://localhost:3001/getClientOrders/" + props.user.id, {
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
    }

    useEffect(() => {
        getPurchases()
    }, [sortOpt]);

    const cancelOrder = (orderID,status) => {
        if (window.confirm(translate("offer_delete_confirm")) === true) {
            fetch("http://localhost:3001/cancelOrder", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
                body: JSON.stringify({
                    id: orderID,
                    status: status==="pending"?"canceled":"returned"
                })
            })
                .then(()=>{
                    getPurchases()
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
                <td>{purchase.price} zł</td>
                <td>{purchase.size}</td>
                <td>{purchase.status}</td>
                <td>{new Date(purchase.createdAt).toLocaleString()}</td>
                <td>{purchase.status === "completed" ? (
                      <Link to={"/review/" + purchase.Product.id}>
                        {translate("add_review")}
                      </Link>
                    ) : (
                      "-"
                    )}
                </td>
                <td>
                        
                        
                        {purchase.status==="pending"?<a onClick={() => cancelOrder(purchase.id,purchase.status)} className="underlined">{translate("cancel_order")}</a>:
                    purchase.status==="completed"?<a onClick={() => cancelOrder(purchase.id,purchase.status)} className="underlined">{translate("return_product")}</a>:"-"}
                        
                </td>
                <td><Link to={"/" + purchase.Product.id}>{translate("offer_page")}</Link></td>
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
                    <th>{translate("name")}</th>
                    <th>{translate("category")}</th>
                    <th>{translate("price")}</th>
                    <th>{translate("size")}</th>
                    <th>{translate("status")}</th>
                    <th>{translate("purchase_time")}</th>
                    <th>{translate("add_review")}</th>
                    <th>{translate("activities")}</th>
                    <th>{translate("url")}</th>
                </tr>
                </thead>
                {purchaseList}
            </table>
        </>
    )
}

export default PurchaseHistory;