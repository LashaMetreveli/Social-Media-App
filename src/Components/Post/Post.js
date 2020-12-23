import React, { useState, useEffect } from "react";
import { Avatar } from "@material-ui/core";
import { db } from "../../firebase";
import firebase from "firebase";

import style from "./Post.module.css";

function Post({ postId, user, imageUrl, username, caption, id }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  return (
    <div className={style.post}>
      <div className={style.post__header}>
        <Avatar className={style.post__avatar} alt="avatar" src={imageUrl} />
        <h3 className={style.username}>{username}</h3>
      </div>

      <img className={style.post__image} src={imageUrl} />
      <h4 className={style.post__text}>
        <strong>{username}</strong>: {caption}
      </h4>

      <div className={style.post__comments}>
        {comments.map((comment) => (
          <p className={style.post__comment}>
            <b>{comment.username}</b> {comment.text}
          </p>
        ))}
      </div>

      {user && (
        <form className={style.post_comment_container}>
          <input
            className={style.post__input}
            type="text"
            placeholder="add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className={style.comment_button}
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
