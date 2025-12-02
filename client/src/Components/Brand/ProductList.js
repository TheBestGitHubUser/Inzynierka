import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import SearchBar from "../SearchBar";
import {useTranslation} from "react-i18next";

const ProductList = (props) => {
    const [offers, setOffers] = useState([]);
    const [translate, i18n] = useTranslation("global");
    const [searched, setSearched] = useState('');

    useEffect(() => {
        fetch("http://localhost:3001/brands/getProducts/"+ props.user.id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setOffers(data
                    .filter(o => o.name.includes(searched))
                )
            })
            .catch(err => alert(translate("operation_unsuccessful")));
    }, []);

    const deleteOffer = (offerId) => {
        if (window.confirm(translate("offer_delete_confirm")) === true) {
            fetch("http://localhost:3001/deleteProduct/" + offerId, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
            })
                .catch(err => alert(translate("operation_unsuccessful")));
        }
    }

    const offerList = offers.map((offer) => {
        return (
            <tbody key={offer.id}>
            <tr>
                <th>{offer.id}</th>
                <td>{offer.name}</td>
                <td>{offer.description}</td>
                <td>{offer.price}</td>
                <td>{offer.category}</td>
                <td><Link to={"/brand/productVariant/"+offer.id}>{translate("add_amount")}</Link></td>
                <td><Link to={"/brand/productReviews/"+offer.id}>{translate("reviews")}</Link></td>
                <td><Link to={offer.id + "/"}>{translate("edit")}</Link></td>
                <td><a onClick={() => deleteOffer(offer.id)} className="underlined">{translate("delete")}</a></td>
            </tr>
            </tbody>
        );
    });

    return (
        <div className="center container">
            <h1>{translate("offers")}</h1>
            <SearchBar setSearched={setSearched}/><br/>
            <Link id="new" to="new">{translate("add_offer")}</Link><br/>
            <table>
                <thead>
                <tr>
                    <th>id</th>
                    <th>{translate("name")}</th>
                    <th>{translate("description")}</th>
                    <th>{translate("price")}</th>
                    <th>{translate("category")}</th>
                    <th>{translate("add_amount")}</th>
                    <th>{translate("reviews")}</th>
                    <th>{translate("edit")}</th>
                    <th>{translate("delete")}</th>
                </tr>
                </thead>
                {offerList}
            </table>
        </div>
    );
};

export default ProductList;