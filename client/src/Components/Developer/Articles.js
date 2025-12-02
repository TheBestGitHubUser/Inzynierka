import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import SearchBar from "../SearchBar";
import {useTranslation} from "react-i18next";

const ArticleList = (props) => {
    const [articles, setArticles] = useState([]);
    const [translate, i18n] = useTranslation("global");
    const [searched, setSearched] = useState('');

    useEffect(() => {
        fetch("http://localhost:3001/getDevArticles/"+ props.user.id,{
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setArticles(data
                    .filter(o => o.title.includes(searched))
                )
            })
            .catch(err => alert(translate("operation_unsuccessful")));
    }, []);

    const deleteArticle = (articleID) => {
        if (window.confirm(translate("offer_delete_confirm")) === true) {
            fetch("http://localhost:3001/deleteArticle/" + articleID, {method: "DELETE"})
                .catch(err => alert(translate("operation_unsuccessful")));
        }
    }

    const offerList = articles.map((article) => {
        return (
            <tbody key={article.id}>
            <tr>
                <th>{article.id}</th>
                <td>{article.title}</td>
                <td>{article.views}</td>
                <td><Link to={"comments/"+article.id}>{translate("comments")}</Link> </td>
                <td><Link to={article.id+"/"}>{translate("edit")}</Link></td>
                <td><a onClick={() => deleteArticle(article.id)} className="underlined">{translate("delete")}</a></td>
            </tr>
            </tbody>
        );
    });

    return (
        <div className="center container">
            <h1>{translate("articles")}</h1>
            <SearchBar setSearched={setSearched}/><br/>
            <Link id="new" to="new">{translate("add_article")}</Link><br/>
            <table>
                <thead>
                <tr>
                    <th>id</th>
                    <th>{translate("title")}</th>
                    <th>{translate("views")}</th>
                    <th>{translate("comments")}</th>
                    <th>{translate("edit")}</th>
                    <th>{translate("delete")}</th>
                </tr>
                </thead>
                {offerList}
            </table>
        </div>
    );
};

export default ArticleList;