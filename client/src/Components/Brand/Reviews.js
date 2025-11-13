import React, {useState, useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import SearchBar from "../SearchBar";
import {useTranslation} from "react-i18next";

const Reviews = (props) => {
    const [reviews, setReviews] = useState([]);
    const {productID} = useParams();
    const [translate, i18n] = useTranslation("global");

    useEffect(() => {
        fetch("http://localhost:3001/getProductReviews/"+ productID)
            .then(res => res.json())
            .then(data => setReviews(data))
            .catch(err => alert(translate("operation_unsuccessful")));
    }, []);


    const offerList = reviews.map((review) => {
        return (
            <tbody key={review.id}>
            <tr>
                <th>{review.id}</th>
                <td>{review.Client?.User?.name}</td>
                <td>{review.rating}</td>
                <td>{review.comment}</td>
            </tr>
            </tbody>
        );
    });

    const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

    return (
        <div className="center container">
            <h1>{translate("reviews")}</h1>
            <strong>{translate("average rating")}: {averageRating}</strong>
            <table>
                <thead>
                <tr>
                    <th>id</th>
                    <th>{translate("name")}</th>
                    <th>{translate("rating")}</th>
                    <th>{translate("comment")}</th>
                </tr>
                </thead>
                {offerList}
            </table>
        </div>
    );
};

export default Reviews;