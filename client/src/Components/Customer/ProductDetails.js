import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Warning from "../Warning";
import NoPage from "../NoPage";
import {useTranslation} from "react-i18next";

const ProductDetails = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    const {offerId} = useParams();
    const [product, setProduct] = useState({});
    const [sizeID, setSizeID] = useState('');
    const [variants, setVariants] = useState([]);
    const [warning, setWarning] = useState("");
    const [reviews, setReviews] = useState([])

    useEffect(() => {
        fetch("http://localhost:3001/getProductDetails/" + offerId)
            .then(res => res.json())
            .then(data => setProduct(data))
            .catch(err => alert(translate("connection_error")));
        
        fetch("http://localhost:3001/getProductVariants/" + offerId)
            .then(res => res.json())
            .then(data => setVariants(data))
            .catch(err => alert(translate("connection_error")));
            
        fetch("http://localhost:3001/getProductReviews/" + offerId)
            .then(res => res.json())
            .then(data => setReviews(data))
            .catch(err => alert(translate("connection_error")));
    }, []);

    if (product.id === null)
        return <NoPage/>


    const proceedToPayment = () => {
        if(sizeID === "" || sizeID ===undefined){
            setWarning("size_is_not_choosen")
            return
        }else{
            navigate("/purchase/"+offerId+"/"+sizeID)
        }
            

    }

    const reviewList = reviews.length > 0 ? (
  reviews.map((review) => (
    <div 
      key={review.id} 
      className="review-box" 
    >
      <strong>{review.Client?.User?.name || translate("anonymous")}</strong><br/>
      <span>
        {translate("rating")}:{" "} ({review.rating}/5)
      </span>
      <p style={{ marginTop: "5px" }}>{review.comment}</p>
    </div>
    ))
    ) : (
        <p>{translate("no_reviews_yet")}</p>
    );


    return (
        <div className="center container two-columns">
            <img src={product.imgURL} alt="box art" className="large-product-img"/>
            <div id="product-details">
                <h1>{product.name}</h1><br/>
                <strong>{translate("price")}: </strong>{product.price}<br/>
                <strong>{translate("category")}: </strong>{product.category}<br/>
                <strong>{translate("description")}: </strong>{product.description}<br/><br/>
                <br></br>
                <h3>{translate("seller_info")}</h3>
                <strong>{translate("seller")}: </strong>{product.Brand?.User?.name}<br/>

                <strong>{translate("sizes")}:</strong><br/>
                <select id="variantSelect" 
                onChange={(e)=> setSizeID(e.target.value)}>
                  <option value="">-- wybierz wariant --</option>
                  {variants.map(v => (
                    <option key={v.id} value={v.id} disabled={v.stock===0}>
                      {v.size} - {v.stock}
                    </option>
                  ))}
                </select>
                <br/>
                <br/>
                <button onClick={() => props.user.id === undefined ? navigate("/login") :proceedToPayment()}
                 disabled={variants===undefined || variants.length<1}>{translate("proceed_to_payment")}</button><br/>

                 <Warning message={warning}/>
            
            </div>
            <div id="reviews">
                <strong>{translate("reviews")}: </strong><br/>
                {reviewList}
            </div>
        </div>
    );
}

export default ProductDetails;