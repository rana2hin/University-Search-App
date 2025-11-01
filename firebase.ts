import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-3CwiSB9NkKugXaKTkSZUVClHdzzGYYY",
  authDomain: "unisearchdb.firebaseapp.com",
  projectId: "unisearchdb",
  storageBucket: "unisearchdb.appspot.com",
  messagingSenderId: "375846947059",
  appId: "1:375846947059:web:b7ce00ed36507a09988f86"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the Firestore database service
export const db = getFirestore(app);
