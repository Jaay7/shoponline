import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBtB3ObxR8rw4hQUgG-Mo4isJoTgkB1l40",
  authDomain: "shoponline-7309a.firebaseapp.com",
  projectId: "shoponline-7309a",
  storageBucket: "shoponline-7309a.appspot.com",
  messagingSenderId: "235173549457",
  appId: "1:235173549457:web:0a48a648ec0f3aa015b630",
  measurementId: "G-E2BPYZEK2E"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
