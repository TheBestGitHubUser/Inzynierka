import React, {useState, useEffect} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import Warning from "../Warning";
import NoPage from "../NoPage";
import {useTranslation} from "react-i18next";
import {validatePrice} from "../../Utils";

const ArticleEdit = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    const {articleID} = useParams();
    const [article, setArticle] = useState({
        id: '',
        developerID: props.user.id,
        title: '',
        content: '',
        imgURL: '',
        views: 0
    });
    const [warning, setWarning] = useState('');

    useEffect(() => {
        
            if (articleID !== 'new') {
            fetch("http://localhost:3001/getArticle/" + articleID)
                .then(res => res.json())
                .then(data => setArticle(data))
                .catch(err => alert(translate("operation_unsuccessful")));
        
            }
    }, []);


    const acceptChanges = async (articleID) => {
        if (article.title === '') {
            setWarning(translate("title_can't_be_empty"))
            return;
        }

        if (article.content === '') {
            setWarning(translate("content_can't_be_empty"))
            return;
        }

        if (article.id === '') {
            const promise = fetch("http://localhost:3001/putArticle", {
                method: "PUT",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(article)
            })
                .then(res => res.json())
                .catch(err => alert(translate("operation_unsuccessful")));


        } else {
            fetch("http://localhost:3001/postArticle/", {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(article)
            })
            
        }

        exit();
    }

    const exit = () => {
        navigate("/emp/articles");     
    }

    return (
        <div className="center container two-columns">
            <h1>{article.id === '' ? "Dodaj article" : "Edytuj article"}</h1><br/>
            <div className="form"> 
                <label>{translate("title")}</label><br/>
                <input type="text" defaultValue={article.title} id="title-input" onChange={e => article.title = e.target.value}/><br/>
                <label>{translate("content")}</label><br/>
                <input type="text" defaultValue={article.content} id="content-input" onChange={e => article.content = e.target.value}/><br/>
                <label>{translate("image")}</label><br/>
                <input type="text" defaultValue={article.imgURL} id="url-input" onChange={e => {
                    article.imgURL = e.target.value;
                    document.getElementById("box-art").src = e.target.value;
                }}/><br/>

                <img src={article.imgURL} alt="box art" className="large-product-img" id="box-art"/><br/>
                <button onClick={() => acceptChanges(articleID)}>{translate("accept")}</button>
                <button onClick={() => exit()}>{translate("cancel")}</button>
                <Warning message={warning}/>
            </div>
        </div>
    );
}

export default ArticleEdit;