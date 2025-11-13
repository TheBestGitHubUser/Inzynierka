import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {OfferSortOptions, sortOffers} from "../OfferSortOptions";
import {useTranslation} from "react-i18next";
import Pagination from "../Pagination"

const ProductList = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    const [products, setProducts] = useState([]);
    const [sortOpt, setSortOpt] = useState(0);
    const [priceRangeFrom, setPriceRangeFrom] = useState(0);
    const [priceRangeTo, setPriceRangeTo] = useState(1000);
    const [category, setCategory] = useState("");

    const[currentPage,setCurrentPage] = useState(1);
    const[postPerPage,setPostPerPage] = useState(5);

    useEffect(() => {

        fetch("http://localhost:3001/getProducts")
            .then(res => res.json())
            .then(data => {
                setProducts(
                    data.filter(prod => prod.name.toLowerCase().includes(props.searched))
                        .filter(prod => prod.price >= (isNaN(priceRangeTo) ? 0 : priceRangeFrom))
                        .filter(prod => prod.price <= (isNaN(priceRangeTo) ? 2000 : priceRangeTo))
                        .filter(prod => prod.category.includes(category))
                        .sort((p1,p2) => sortOffers(p1, p2, sortOpt))
                )
            })
            .catch(err => {
                alert(translate("conection_error"))
                console.log(err);
            });
    }, [props.searched, sortOpt, priceRangeFrom, priceRangeTo, category]);

    const lastPostIndex = currentPage * postPerPage
    const firstPostIndex = lastPostIndex - postPerPage
    const currentPosts = products.slice(firstPostIndex,lastPostIndex)

    const productList = currentPosts.map((product) => {
        return (
            <div className="container product-card" onClick={() => navigate(product.id + "")} key={product.id}>
                <img src={product.imgURL} alt="box art" className="product-img"/>
                <h3>{product.name}</h3>
                {product.price} zł
            </div>
        );
    });

    return (
        <>
        <div id="main">
            <div id="options" className="container">
                <label htmlFor="sort_options"><h3>sortuj</h3></label>
                <OfferSortOptions setSortOpt={setSortOpt}/>
                <h3>filtry</h3>
                cena<br/>
                <input type="number" placeholder={translate("from")} onChange={e => setPriceRangeFrom(parseInt(e.target.value))}/>
                <input type="number" placeholder={translate("to")} onChange={e => setPriceRangeTo(parseInt(e.target.value))}/>
                <br/>
                <select onChange={e => setCategory(e.target.value)}>
                    <option value="">{translate("all")}</option>
                    <option value="obuwie">{translate("shoes")}</option>
                    <option value="akcesoria">{translate("accessories")}</option>
                    <option value="przyrzad">{translate("devices")}</option>
                    <option value="odziez">{translate("clothing")}</option>
                </select>
            </div>
            <div id="product-list">
                {productList}
            </div>
            </div>
        <div><Pagination totalPosts = {products.length} postPerPage = {postPerPage}
                setCurrentPage={setCurrentPage} currentPage = {currentPage}/></div>  
        </>
        
        
        
    );
}

export default ProductList;