import { Button, Input } from "@material-ui/core";
import React, { useState } from "react";
import style from "./UploadImage.module.css";
import { db } from "../../firebase";
import firebase from "firebase";
import "firebase/storage"; // <----

function ImageUpload({ username }) {
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState("");
  const [image, setImage] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = firebase
      .storage()
      .ref(`images/${image.name}`)
      .put(image);

    uploadTask.on(
      "state_change",
      (snapshot) => {
        setProgress("uploading...");
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        firebase
          .storage()
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });

            setProgress("");
            setCaption("");
            setImage("");
          });
      }
    );
  };

  return (
    <div className={style.container}>
      <h4>{progress}</h4>
      <Input
        className={style.caption}
        type="text"
        value={caption}
        onChange={(event) => setCaption(event.target.value)}
        placeholder="what is in your mind..."
      />
      <input type="file" onChange={handleChange} />
      <Button className={style.upload} onClick={handleUpload}>
        Post
      </Button>
    </div>
  );
}

export default ImageUpload;
