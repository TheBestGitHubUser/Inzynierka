import React, {useState, useEffect} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import Warning from "../Warning";
import NoPage from "../NoPage";
import {useTranslation} from "react-i18next";
import {validatePrice} from "../../Utils";

const OrderEdit = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    const {orderID} = useParams();
    const [order, setOrder] = useState({});
    const [warning, setWarning] = useState('');

    useEffect(() => {
        fetch("http://localhost:3001/getOrder/" + orderID)
            .then(res => res.json())
            .then(data => setOrder(data))
            .catch(err => alert(translate("operation_unsuccessful")));
    
    }, []);

    if (order.id === null)
        return <NoPage/>

    const acceptChanges = async (orderID) => {
        if (order.name === '') {
            setWarning(translate("enter_name"))
            return;
        }
        if (order.surname === '') {
            setWarning(translate("incorrect_surname"))
            return;}

        if (order.address === '') {
            setWarning(translate("incorrect_address"))
            return;}

        fetch("http://localhost:3001/postOrder", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(order)
        })
        
        exit();
    }

    const exit = () => {
        navigate("/brand/orders");
        
    }

    return (
        <div className="center container two-columns">
            <h1>{translate('edit_order')}</h1><br/>
            <div className="form"> 
                <label>{translate("name")}</label><br/>
                <input type="text" defaultValue={order.name} id="name-input" onChange={e => order.name = e.target.value}/><br/>
                <label>{translate("surname")}</label><br/>
                <input type="text" defaultValue={order.surname} id="name-input" onChange={e => order.surname = e.target.value}/><br/>
                <label>{translate("size")}</label><br/>
                <strong>{order.size}</strong><br/>
                <label>{translate("price")}</label><br/>
                <input type="text" defaultValue={order.price} id="description-input" onChange={e => order.price = e.target.value}/><br/>
                <label>{translate("address")}</label><br/>
                <input type="text" defaultValue={order.address} id="description-input" onChange={e => order.address = e.target.value}/><br/>
                <label>{translate("category")}</label><br/>
                <select value={order.status} onChange={e => setOrder({...order, status: e.target.value})}>
                    <option value='pending'>{translate("pending")}</option>
                    <option value='processing'>{translate("processing")}</option>
                    <option value='completed'>{translate("completed")}</option>
                </select>
                <br/>
                <button onClick={() => acceptChanges(orderID)}>{translate("accept")}</button>
                <button onClick={() => exit()}>{translate("cancel")}</button>
                <Warning message={warning}/>
            </div>
        </div>
    );
}

export default OrderEdit;