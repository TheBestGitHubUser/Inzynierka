import React, {useState, useEffect} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import Warning from "../Warning";
import NoPage from "../NoPage";
import {useTranslation} from "react-i18next";
import {validatePrice} from "../../Utils";

const OfferEdit = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    const {productID} = useParams();
    const [offer, setOffer] = useState({
        brandID: props.user.id,
        name: '',
        price: '',
        description: '',
        category: '',
        imgURL: ''
    });
    const [warning, setWarning] = useState('');

    useEffect(() => {
        if (productID !== 'new') {
            fetch("http://localhost:3001/getProduct/" + productID)
                .then(res => res.json())
                .then(data => setOffer(data))
                .catch(err => alert(translate("operation_unsuccessful")));
        }
    }, []);

    if (offer.id === null)
        return <NoPage/>

    const acceptChanges = async (productID) => {
        if (offer.name === '') {
            setWarning(translate("enter_name"))
            return;
        }
        if (!validatePrice(offer.price)) {
            setWarning(translate("incorrect_price"))
            return;}
        
        if (offer.category.length <= 0) {
            setWarning(translate("choose category"))
            return;
        }
        if (offer.imgURL.length <= 0) {
            setWarning(translate("enter_image"))
            return;
        }

        if (productID === 'new') {
            const promise = fetch("http://localhost:3001/putProduct", {
                method: "PUT",
                headers: {'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(offer)
            })
                .then(res => res.json())
                .then(data => data.insertId)
                .catch(err => alert(translate("operation_unsuccessful")));


        } else {
            fetch("http://localhost:3001/postProduct/" + productID, {
                method: "POST",
                headers: {'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(offer)
            })
        }

        exit();
    }

    const exit = () => {
        navigate("/brand/products");
        
    }

    return (
        <div className="center container two-columns">
            <h1>{productID === 'new' ? "Dodaj ofertę" : "Edytuj ofertę"}</h1><br/>
            <div className="form"> 
                <label>{translate("name")}</label><br/>
                <input type="text" defaultValue={offer.name} id="name-input" onChange={e => offer.name = e.target.value}/><br/>
                <label>{translate("price")} [PLN]</label><br/>
                <input type="number" defaultValue={offer.price} id="price-input" onChange={e => offer.price = e.target.value}/><br/>
                <label>{translate("description")}</label><br/>
                <input type="text" defaultValue={offer.description} id="description-input" onChange={e => offer.description = e.target.value}/><br/>
                <label>{translate("category")}</label><br/>
                <select value={offer.category} onChange={e => setOffer({...offer, category: e.target.value})}>
                    <option value=''>{translate("choose category")}</option>
                    <option value='obuwie'>{translate("obuwie")}</option>
                    <option value='akcesoria'>{translate("akcesoria")}</option>
                    <option value='przyrzad'>{translate("przyrzad")}</option>
                    <option value='odziez'>{translate("odziez")}</option>
                </select>
                <label>{translate("image_url")}</label><br/>
                <input type="text" defaultValue={offer.imgURL} id="url-input" onChange={e => {
                    offer.imgURL = e.target.value;
                    document.getElementById("box-art").src = e.target.value;
                }}/><br/>

                <img src={offer.imgURL} alt="box art" className="large-product-img" id="box-art"/><br/>
                <button onClick={() => acceptChanges(productID)}>{translate("accept")}</button>
                <button onClick={() => exit()}>{translate("cancel")}</button>
                <Warning message={warning}/>
            </div>
        </div>
    );
}

export default OfferEdit;