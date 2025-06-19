// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // ✅ Auth
import { getFirestore } from "firebase/firestore"; // ✅ Firestore
import { getStorage } from "firebase/storage"; // ✅ Storage
import { getAnalytics } from "firebase/analytics"; // ✅ Analytics

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8ydX9d_6TWzKSL8UZwhKM-LYWRTDXcYw",
  authDomain: "firelance-180c9.firebaseapp.com",
  projectId: "firelance-180c9",
  storageBucket: "firelance-180c9.appspot.com", // <-- Correct storageBucket domain
  messagingSenderId: "614131645253",
  appId: "1:614131645253:web:cb5ed41b23aff9c3c29c2c",
  measurementId: "G-1HSKFWD977",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // <-- Initialize storage

// Export Firebase services
export { auth, db, storage };
