import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyB9-2S-qS06_VYbj7pPOhrCz1lLReMef58",
  authDomain: "socialmediaapp-6be94.firebaseapp.com",
  databaseURL: "https://socialmediaapp-6be94-default-rtdb.firebaseio.com",
  projectId: "socialmediaapp-6be94",
  storageBucket: "socialmediaapp-6be94.appspot.com",
  messagingSenderId: "601888009932",
  appId: "1:601888009932:web:009de7314b589f8a255c69",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage;

export { db, auth, storage };
