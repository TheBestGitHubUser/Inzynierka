import React, {useState, useEffect} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import Warning from "../Warning";
import NoPage from "../NoPage";
import {useTranslation} from "react-i18next";
import {validatePrice} from "../../Utils";

const ReviewEdit = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    const {productID} = useParams();
    const [review, setReview] = useState({
        id: '',
        clientID: props.user.id,
        productID: productID,
        rating: '',
        comment: ''
    });
    const [warning, setWarning] = useState('');

    useEffect(() => {
        
            fetch("http://localhost:3001/getReview/"+props.user.id+"/" + productID)
                .then(res => {
                    if (res.ok && res.headers.get("Content-Length") !== "0") {
                    return res.json();
                }
                    return {};
                })
                .then(data => {
                    if (data && Object.keys(data).length > 0) {
                        setReview(data);
                }})
                .catch(err => alert(translate("operation_unsuccessful")));
    }, []);


    const acceptChanges = async (productID) => {
        if (review.rating < 1 || review.rating>5) {
            setWarning(translate("rating_from_1_to_5"))
            return;
        }

        if (review.comment === '') {
            setWarning(translate("comment_cant_be_empty"))
            return;
        }

        if (review.id === '') {
            const promise = fetch("http://localhost:3001/putReview", {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem("token")}`},
                body: JSON.stringify(review)
            })
                .then(res => res.json())
                .then(data => data.insertId)
                .catch(err => alert(translate("operation_unsuccessful")));


        } else {
            fetch("http://localhost:3001/postReview/", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem("token")}`},
                body: JSON.stringify(review)
            })
            
        }

        exit();
    }

    const exit = () => {
        navigate("/profile/purchases");     
    }

    return (
        <div className="center container two-columns">
            <h1>{review.id === '' ? "Dodaj review" : "Edytuj review"}</h1><br/>
            <div className="form"> 
                <label>{translate("rating")}</label><br/>
                <input type="number" defaultValue={review.rating} id="rating-input" onChange={e => review.rating = e.target.value}/><br/>
                <label>{translate("comment")}</label><br/>
                <input type="text" defaultValue={review.comment} id="comment-input" onChange={e => review.comment = e.target.value}/><br/>
                <button onClick={() => acceptChanges(productID)}>{translate("accept")}</button>
                <button onClick={() => exit()}>{translate("cancel")}</button>
                <Warning message={warning}/>
            </div>
        </div>
    );
}

export default ReviewEdit;