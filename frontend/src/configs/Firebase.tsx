// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBo6hvlhKLbjHAowtEQLPJB6puKdWvbtwQ",
  authDomain: "project-04-6639f.firebaseapp.com",
  projectId: "project-04-6639f",
  storageBucket: "project-04-6639f.appspot.com",
  messagingSenderId: "819495100364",
  appId: "1:819495100364:web:bd76914e95431b3abb0769",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provide = new GoogleAuthProvider();
