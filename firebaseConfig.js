// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

//import { getAnalytics } from "firebase/analytics";

import { getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth";



const firebaseConfig = {

    apiKey: "AIzaSyCiG7nqQGe5jt2-frvf2BGL4vng90R3VgY",

    authDomain: "ppark-998b8.firebaseapp.com",

    projectId: "ppark-998b8",

    storageBucket: "ppark-998b8.appspot.com",

    messagingSenderId: "962160416294",

    appId: "1:962160416294:web:a5f84a7775de87b132b8e7",

    measurementId: "G-E3YZ73HKFE"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

//const analytics = getAnalytics(app);

const db = getFirestore(app);

const auth = getAuth(app);


export { db, auth };