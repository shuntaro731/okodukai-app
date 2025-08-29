import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"  //firestoreを使えるようにimport

const firebaseConfig = { //envファイルでapiキーは一括管理
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig) //firebaseConfigのapiキーを使ってfirebaseに接続
export const db = getFirestore(app) //firestoreをexport(dbという関数で他のファイルでもfirestoreを使えるように)