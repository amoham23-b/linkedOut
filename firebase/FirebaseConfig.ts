
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "",
  authDomain: "linkedout-a983b.firebaseapp.com",
  projectId: "linkedout-a983b",
  storageBucket: "linkedout-a983b.firebasestorage.app",
  messagingSenderId: "864683097998",
  appId: "1:864683097998:web:66f99fd8b9cd7c2edbeedf",
  measurementId: "G-BY7NEXGR1Q"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);