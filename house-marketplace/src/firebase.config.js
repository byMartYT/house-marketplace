// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyC1smd8pS5zTiFwE2AGeL7SjRu172vMzDA",
  authDomain: "housemarket-9ca97.firebaseapp.com",
  projectId: "housemarket-9ca97",
  storageBucket: "housemarket-9ca97.appspot.com",
  messagingSenderId: "685395638188",
  appId: "1:685395638188:web:e4e19d91afbe4f85a22c09"
};

initializeApp(firebaseConfig);
export const db = getFirestore();