import { initializeApp } from "firebase/app"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBP2zdPMJskUZ1LaZ5gIKJCFfTqtT4Qnds",
    authDomain: "okodukai-f02cc.firebaseapp.com",
    projectId: "okodukai-f02cc",
    storageBucket: "okodukai-f02cc.firebasestorage.app",
    messagingSenderId: "653534687742",
    appId: "1:653534687742:web:a39f35c248b93dd34290af",
    measurementId: "G-BM00QFHY30"
};

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// Development: Enable Firestore emulator for local testing if needed
// Uncomment the line below to use local emulator instead of production
// if (location.hostname === 'localhost') {
//   connectFirestoreEmulator(db, 'localhost', 8080)
// }