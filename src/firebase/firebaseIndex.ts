import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

export const config = {
  apiKey: process.env.REACT_APP_API_KEY ?? '',
  authDomain: process.env.REACT_APP_AUTHDOMAIN ?? '',
  databaseURL: process.env.REACT_APP_BASEURL ?? '',
  projectId: process.env.REACT_APP_PROJECT_ID ?? '',
  storageBucket: process.env.REACT_APP_STORAGEBUCKET ?? '',
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID ?? '',
  appId: process.env.REACT_APP_APP_ID ?? '',
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();