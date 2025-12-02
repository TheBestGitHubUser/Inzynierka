import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import Pagination from "../Pagination"

const ArticleList = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    const [tournaments, setTournaments] = useState([]);
    const [status, setStatus] = useState("");

    const[currentPage,setCurrentPage] = useState(1);
    const[postPerPage,setPostPerPage] = useState(5);

    useEffect(() => {
        fetch("http://localhost:3001/getArticles")
            .then(res => res.json())
            .then(data => {
                setTournaments(
                    data.filter(article => article.title.toLowerCase().includes(props.searched))
                )
            })
            .catch(err => {
                alert(translate("conection_error"))
                console.log(err);
            });
    }, [props.searched, status]);

    const lastPostIndex = currentPage * postPerPage
    const firstPostIndex = lastPostIndex - postPerPage
    const currentPosts = tournaments.slice(firstPostIndex,lastPostIndex)

    const ArticleList = currentPosts.map((tour) => {
        return (
            <div className="container product-card" onClick={() => navigate(tour.id + "")} key={tour.id}>
                <img src={tour.imgURL} alt="box art" className="product-img"/>
                <h3>{tour.title}</h3>
                {translate("views")}: {tour.views}
            </div>
        );
    });

    return (
        <>
        <div id="main">
            <div id="product-list">
                {ArticleList}
            </div>
            </div>
        <div><Pagination totalPosts = {tournaments.length} postPerPage = {postPerPage}
                setCurrentPage={setCurrentPage} currentPage = {currentPage}/></div>  
        </>
        
        
        
    );
}

export default ArticleList;