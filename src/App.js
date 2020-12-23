import React, { useState, useEffect } from "react";
import { fetchUser } from "./redux/actions";
import { connect, useDispatch, useSelector } from "react-redux";

import "./App.css";
import Post from "./Components/Post/Post";

import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";

import { auth, db } from "./firebase";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./Components/PostUpload/UploadImage";
import Profile from "./Components/Profile/Profile";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "1px solid transperent",
    borderRadius: "5px",
    padding: theme.spacing(2, 4, 3),
  },
}));

function App(props) {
  const dispatch = useDispatch();

  const [posts, setPosts] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loggedInUser, setUser] = useState("");

  const [page, setPage] = useState("landing");

  const [open, setOpen] = useState(false);
  const [openSignin, setOpenSignIn] = useState(false);

  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();

  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  useEffect(() => {
    if (loggedInUser.displayName) {
      dispatch(fetchUser(loggedInUser.displayName));
      console.log(props.user);
    }
  }, [loggedInUser]);

  useEffect(() => {
    document.title = "Instagram Clone";

    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log("user: ", authUser.email, " is now logged in");
        setUser(authUser);
      } else {
        console.log("logged out..");
        setUser(null);
      }
    });

    //cleanup
    return () => {
      unsubscribe();
    };
  }, [loggedInUser, username]);

  useEffect(() => {
    db.collection("posts").onSnapshot((snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }))
      );
    });
  }, []);

  const changePage = () => {
    if (page === "landing") {
      setPage("profile");
    } else {
      setPage("landing");
    }
  };

  return (
    <div className="app">
      {loggedInUser?.displayName ? (
        <ImageUpload username={loggedInUser.displayName} />
      ) : (
        <h3>Please Log In To Upload Image</h3>
      )}

      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="register">
            <center>
              <img
                className="app__header__image"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="logo"
              />
            </center>

            <Input
              className="inpt"
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              className="inpt"
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              className="inpt"
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignin} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="register">
            <center>
              <img
                className="app__header__image"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="logo"
              />
            </center>
            <Input
              className="inpt"
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              className="inpt"
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              Log In
            </Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img
          className="app__logo"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="logo"
        />
        {loggedInUser ? (
          <>
            <Button onClick={changePage} className="btn">
              {page === "landing" ? "Profile" : "Main"}
            </Button>
            <Button onClick={() => auth.signOut()} className="btn">
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button className="btn" onClick={() => setOpen(true)}>
              Sign Up
            </Button>
            <Button className="btn" onClick={() => setOpenSignIn(true)}>
              Log In{" "}
            </Button>
          </>
        )}
      </div>

      {page === "landing" && (
        <div className="post_container">
          {posts.map(({ id, post }) => (
            <Post
              className="post"
              postId={id}
              user={loggedInUser}
              key={id}
              username={post.username}
              imageUrl={post.imageUrl}
              caption={post.caption}
            />
          ))}
        </div>
      )}

      {page === "profile" && (
        <div className="profile">
          <Profile setPage={setPage} />
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUser: (displayName) => dispatch(fetchUser(displayName)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
