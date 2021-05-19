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

const fireDb = firebase.initializeApp(firebaseConfig);
const firestore = firebase.storage();
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

const firebaseDb = fireDb.database().ref();
const auth = firebase.auth();
const signInWithGoogleRedirect = () => auth.signInWithRedirect(googleProvider);
const signInWithGooglePopup = () => auth.signInWithPopup(googleProvider);

export {
  auth,
  firebaseDb,
  firestore,
  signInWithGooglePopup,
  signInWithGoogleRedirect,
};
export default firebase;
