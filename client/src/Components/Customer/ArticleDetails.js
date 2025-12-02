import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Warning from "../Warning";
import NoPage from "../NoPage";
import { useTranslation } from "react-i18next";

const ArticleDetails = (props) => {
  const navigate = useNavigate();
  const [translate] = useTranslation("global");
  const { articleID } = useParams();
  const [article, setArticle] = useState({});
  const [warning, setWarning] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const effectRan = useRef(false);

  // Pobranie danych artykułu + komentarzy
  useEffect(() => {

    if (!effectRan.current) {

    fetch("http://localhost:3001/getArticleDetails/" + articleID)
      .then((res) => res.json())
      .then((data) => setArticle(data))
      .catch((err) => alert(translate("connection_error")));

    fetch("http://localhost:3001/getComments/" + articleID)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => alert(translate("connection_error")));

    fetch("http://localhost:3001/increaseViews", { method: "POST" 
      ,headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  id: articleID,
                })
      })
      effectRan.current = true;
    }
  }, [articleID]);

  if (!article || !article.id) return <NoPage />;

  const handleAddComment = () => {
    if (newComment.trim() === "") {
      setWarning(translate("comment_cant_be_empty"));
      return;
    }

    const commentData = {
      articleID: article.id,
      clientID: props.user?.id,
      content: newComment,
    };

    fetch("http://localhost:3001/putComment", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(commentData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add comment");
        setNewComment("");
        setWarning("");
        
        return fetch("http://localhost:3001/getComments/" + articleID);
      })
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch(() => alert(translate("operation_unsuccessful")));
  };


  const commentList =
    comments.length > 0 ? (
      comments.map((comment) => (
        <div key={comment.id} className="review-box">
          <strong>{comment.Client?.User?.name || translate("anonymous")}</strong>
          <p style={{ marginTop: "5px" }}>{comment.content}</p>
          <span className="comment-date">
            {new Date(comment.createdAt).toLocaleString()}
          </span>
        </div>
      ))
    ) : (
      <p>{translate("no_comments_yet")}</p>
    );

  return (
    <div className="article-page container">
      <div className="align-left">
        <h1>{article.title}</h1>
        <p className="article-meta">
          {translate("views")}: {article.views}
        </p>
        <br/>
        <img
          src={article.imgURL}
          alt="article illustration"
          className="large-product-img"
        />
        <p> {article.content}</p>
        <br/>
        <h3 className="mt-4">{translate("author_info")}</h3>
        <p>
          <strong>{translate("author")}:</strong>{" "}
          {article.Developer?.User?.name}
        </p>

        <Warning message={warning} />
      </div>
      <br/>
      <div className="align-left">
      
        <h2>{translate("comments")}</h2>
        {commentList}

        {props.user?.id ? (
          <div className="add-comment">
            <textarea
              placeholder={translate("add_comment_placeholder")}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleAddComment}>
              {translate("add_comment")}
            </button>
          </div>
        ) : (
          <p>
            <a
              onClick={() => navigate("/login")}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              {translate("login_to_comment")}
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default ArticleDetails;
