// Import the Firebase modules that you need in your app.
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

// Initalize and export Firebase.
const config = {
    apiKey: "AIzaSyCpt507p8V7zTYqpEmO0Zu_jecEc30MjY0",
    authDomain: "wc2018-28edc.firebaseapp.com",
    databaseURL: "https://wc2018-28edc.firebaseio.com",
    projectId: "wc2018-28edc",
    storageBucket: "",
    messagingSenderId: "740767467427"
};

firebase.initializeApp(config)

const db = firebase.database();
const auth = firebase.auth();

export { db, auth };