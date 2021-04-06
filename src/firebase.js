import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
	apiKey: "AIzaSyCs4PyXdmO8Dxqg1BcDjSUb2UplF4lhtXo",
    authDomain: "react-instagram-1a785.firebaseapp.com",
    projectId: "react-instagram-1a785",
    storageBucket: "react-instagram-1a785.appspot.com",
    messagingSenderId: "111138804620",
    appId: "1:111138804620:web:02b9b2f7c447cd26b43ca9"
})

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export {db,auth,storage}