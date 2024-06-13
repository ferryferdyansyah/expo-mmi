// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// DB MMI APP WEB FOR BMKG
const firebaseConfig = {
    apiKey: "AIzaSyC_zFqNlSheIz9JJfCCm2bXm6azokQVghU",
    authDomain: "mmi-app-4b147.firebaseapp.com",
    databaseURL: "https://mmi-app-4b147-default-rtdb.firebaseio.com",
    projectId: "mmi-app-4b147",
    storageBucket: "mmi-app-4b147.appspot.com",
    messagingSenderId: "697543482445",
    appId: "1:697543482445:web:a40150cd541d2527f8d004"
};


// DB MMI APP WEB SENDIRI
// const firebaseConfig = {
//     apiKey: "AIzaSyDv45Us8BhCgbxm-f0kU5vJFIuUcLyYvDE",
//     authDomain: "react-native-mmi-app.firebaseapp.com",
//     databaseURL: "https://react-native-mmi-app-default-rtdb.asia-southeast1.firebasedatabase.app",
//     projectId: "react-native-mmi-app",
//     storageBucket: "react-native-mmi-app.appspot.com",
//     messagingSenderId: "541576186641",
//     appId: "1:541576186641:web:e9f31a1350f26cb388dab0"
// };

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = getDatabase();
const storage = getStorage();

export { db, storage };