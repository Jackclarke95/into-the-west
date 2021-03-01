import firebase from "firebase";

let firebaseConfig = {
  apiKey: "AIzaSyDJLonhBywTBq-R2AyP5Hvcg2Lp-gUMogk",
  authDomain: "into-the-west-5869d.firebaseapp.com",
  databaseURL:
    "https://into-the-west-5869d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "into-the-west-5869d",
  storageBucket: "into-the-west-5869d.appspot.com",
  messagingSenderId: "1019951241923",
  appId: "1:1019951241923:web:960fbf221acc3fd05fa076",
};

var fireDb = firebase.initializeApp(firebaseConfig);

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export const firebaseDb = fireDb.database().ref();
export const auth = firebase.auth();
export const signInWithGoogle = () => auth.signInWithPopup(provider);
export default firebase;
