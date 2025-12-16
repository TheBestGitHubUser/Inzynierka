import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import Pagination from "../Pagination"
import { STATUS } from "../Constans";

const TournamentList = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    const [tournaments, setTournaments] = useState([]);
    const [status, setStatus] = useState("");

    const[currentPage,setCurrentPage] = useState(1);
    const[postPerPage,setPostPerPage] = useState(5);
    

    useEffect(() => {
        fetch("http://localhost:3001/getEvents")
            .then(res => res.json())
            .then(data => {
                setTournaments(
                    data.filter(event => event.name.toLowerCase().includes(props.searched))
                        .filter(event => event.status.includes(status))
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

    const TournamentList = currentPosts.map((tour) => {
        return (
            <div className="container product-card" onClick={() => navigate(tour.id + "")} key={tour.id}>
                <img src={tour.imgURL} alt="box art" className="product-img"/>
                <h3>{tour.name}</h3>
                {tour.city}
                <br/>
                {translate(tour.status)}
            </div>
        );
    });

    return (
        <>
        <div id="main">
            <div id="options" className="container">
                <h3>filtry</h3>
                <select onChange={e => setStatus(e.target.value)}>
                    <option value="">{translate("all")}</option>
                    {STATUS.map((option)=>
                        <option value={option.value}>
                            {translate(option.label)}
                        </option>
                    )}
                </select>
            </div>
            <div id="product-list">
                {TournamentList}
            </div>
            </div>
        <div className="center">
            <Pagination totalPosts = {tournaments.length} postPerPage = {postPerPage}
                setCurrentPage={setCurrentPage} currentPage = {currentPage}/></div>  
        </>
        
        
        
    );
}

export default TournamentList;