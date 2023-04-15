import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA5hLVZG1ekE59gNI0EEPdOBWFle_68KQM",
    authDomain: "stock-monitor-a4c10.firebaseapp.com",
    projectId: "stock-monitor-a4c10",
    storageBucket: "stock-monitor-a4c10.appspot.com",
    messagingSenderId: "983835627773",
    appId: "1:983835627773:web:5ca06d70e788183e10ee94",
    measurementId: "G-VXD38BDXQZ"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

export { db };