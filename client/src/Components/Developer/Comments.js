import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Comments = () => {
  const { articleID } = useParams();
  const [translate] = useTranslation("global");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/getComments/" + articleID)
      .then((res) => {
        return res.json();
      })
      .then((data) => setComments(data))
      .catch((err) => {
        alert(translate("operation_unsuccessful"));
      })
  }, [articleID]);

  return (
    <div className="center container">
      <h1>
        {translate("comments_for_article")} #{articleID}
      </h1>
      <Link to="/dev/articles">{translate("back_to_articles")}</Link>
      <br />
      <br />

      {comments.length === 0 ? (
        <p>{translate("no_comments_yet")}</p>
      ) : (
        comments.map((comment) => (
          <div
            key={comment.id}
            className="comment-box"
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "10px",
              marginBottom: "10px",
              backgroundColor: "#f9f9f9",
              textAlign: "left",
              width: "70%",
              marginInline: "auto",
            }}
          >
            <strong>{comment.User?.name || translate("anonymous")}</strong>
            <p style={{ marginTop: "5px" }}>{comment.content}</p>
            <span style={{ fontSize: "0.9em", color: "gray" }}>
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default Comments;