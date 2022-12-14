// This JS file is for registering a new app user ---------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

import { getDatabase, ref, set, update, child, get } 
from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCB4-LVYFHjv178is1O4IhUQBbqfZN4o2Q",
    authDomain: "researchprojfb.firebaseapp.com",
    projectId: "researchprojfb",
    storageBucket: "researchprojfb.appspot.com",
    messagingSenderId: "87505097664",
    appId: "1:87505097664:web:262076e4490d796472ee25"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = getAuth();

// Return instance of your app's FRD
const db = getDatabase(app);

// ---------------- Register New User --------------------------------//
document.getElementById("submitData").onclick = function() {
  const firstName = document.getElementById('firstName').value; 
  const lastName = document.getElementById('lastName').value; 
  const email = document.getElementById('userEmail').value; 

  // Firebase will require a password of at least 6 characters
  const password = document.getElementById('userPass').value;

  // Validate user inputs
  if (!validation(firstName, lastName, email, password)){
    return;
  };

  // Create new app user
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    
    // Add user account info to realtime database
    // 'Set' will create a new reference or completely replace an existing one
    // Each new user will be placed under the 'users' node
    set(ref(db, 'users/' + user.uid + '/accountInfo'), {
      uid: user.uid,    //save userID for home.js reference
      email: email,
      password: encryptPass(password),
      firstname: firstName,
      lastname: lastName
    })
    .then(()=> {
      // Data saved successfully
      alert('User created successfully!')
    })
    .catch((error)=> {
      alert(error)
    });

  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
    // ..
  });

}


// --------------- Check for null, empty ("") or all spaces only ------------//
function isEmptyorSpaces(str){
  return str === null || str.match(/^ *$/) !== null
}

// ---------------------- Validate Registration Data -----------------------//
function validation(firstName, lastName, email, password) {
  let fNameRegex = /^[a-zA-z]+$/;
  let lNameRegex = /^[a-zA-z]+$/;
  let emailRegex = /^[a-zA-Z0-9]+@ctemc\.org$/;

  if(isEmptyorSpaces(firstName) || isEmptyorSpaces(lastName) || isEmptyorSpaces(email) || isEmptyorSpaces(password)) {
    alert("Please complete all fields.");
    return false;
  }

  if(!fNameRegex.test(firstName)){
    alert("The first name should only contain letters.");
    return false;
  }

  if(!lNameRegex.test(lastName)){
    alert("The last name should only contain letters.");
    return false;
  }

  if(!emailRegex.test(email)){
    alert("Please enter a valid email.");
    return false;
  }

  return true;

}

// --------------- Password Encryption -------------------------------------//
function encryptPass(password){
  let encrypted = CryptoJS.AES.encrypt(password, password);
  return encrypted.toString();
}

function decryptPass(password){
  let decrypted = CryptoJS.AES.decrypt(password, password);
  return decrypted.toString();
}

