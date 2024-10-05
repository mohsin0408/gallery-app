import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBIH_8cVrnuEzlSg1lBKSLwWalbuaIAZ_k",
  authDomain: "gallery-app-9f7f7.firebaseapp.com",
  projectId: "gallery-app-9f7f7",
  storageBucket: "gallery-app-9f7f7.appspot.com",
  messagingSenderId: "144982345489",
  appId: "1:144982345489:web:dd01472210243ee5a12eb0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);



export { db, storage, auth };