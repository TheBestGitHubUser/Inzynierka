import React, {useState, useEffect} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import Warning from "../Warning";
import NoPage from "../NoPage";
import {useTranslation} from "react-i18next";
import {validatePrice} from "../../Utils";

const Purchase = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    const {offerID, variantID} = useParams();
    const [product, setProduct] = useState([]);
    const [variant, setVariant] = useState([]);
    const [order, setOrder] = useState({
        clientID: props.user.id,
        productID: offerID,
        name: '',
        surname: '',
        productVariantID: variantID,
        price: product.price,
        address: '',
        status: 'pending'
    });
    const [warning, setWarning] = useState('');

    useEffect(() => {
        fetch("http://localhost:3001/getProductDetails/" + offerID)
            .then(res => res.json())
            .then(data => {setProduct(data)
                    setOrder(prevOrder => ({
                  ...prevOrder,
                  price: data.price
                }))})
            .catch(err => alert(translate("connection_error")));
        
        fetch("http://localhost:3001/getVariant/" + variantID)
            .then(res => res.json())
            .then(data => {setVariant(data)
                setOrder(prevOrder => ({
                  ...prevOrder,
                  size: data.size
                }));
            })
            .catch(err => alert(translate("connection_error")));
    }, []);

    if (order.id === null)
        return <NoPage/>

    const acceptChanges = async () => {
        if (order.name === '') {
            setWarning(translate("enter_name"))
            return;
        }
        if (order.surname === '') {
            setWarning(translate("enter_surname"))
            return;}
        
        if (order.address === '') {
            setWarning(translate("enter_address"))
            return;
        }

        
        fetch("http://localhost:3001/putOrder", {
            method: "PUT",
            headers: {'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem("token")}`},
            body: JSON.stringify(order)
        })
            .catch(err => alert(translate("operation_unsuccessful")));
        
        exit()

    }

    const exit = () => {
        navigate("/thankyou");
        
    }

    return (
        <div className="center container two-columns">
            <h1>{translate("summary")}</h1><br/>
            <strong>{translate("product")}: {product.name}</strong> <br/>
            <strong>{translate("price")}: {product.price}</strong> <br/>
            <strong>{translate("size")}: {variant.size}</strong> <br/>
            <div className="form"> 
                <label>{translate("name")}</label><br/>
                <input type="text" id="name-input" onChange={e => order.name = e.target.value}/><br/>
                <label>{translate("surname")}</label><br/>
                <input type="text" id="surname-input" onChange={e => order.surname = e.target.value}/><br/>
                <label>{translate("address")}</label><br/>
                <input type="text" id="address-input" onChange={e => order.address = e.target.value}/><br/>
                <label>{translate("bank_number")}</label><br/>
                <input type="text" id="bank-input" /><br/>
                <button onClick={() => acceptChanges()}>{translate("buy")}</button>
                <Warning message={warning}/>
            </div>
        </div>
    );
}

export default Purchase;