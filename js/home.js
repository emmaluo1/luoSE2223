// ----------------- Page Loaded After User Sign-in -------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, signOut } 
from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

import { getDatabase, ref, set, update, child, get, remove } 
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


// ---------------------// Get reference values -----------------------------
let userLink = document.getElementById('userLink')      // user name for navbar
let signOutLink = document.getElementById('signOut')    // signout link
let welcome = document.getElementById('welcome')      // Welcome header
let currentUser = null;     // Initialize currentUser to null

// ----------------------- Get User's Name'Name ------------------------------
function getUsername() {
  // Grab the value for the 'keep logged in' switch
  let keepLoggedIn = localStorage.getItem("keepLoggedIn")

  // Grab user information passed from signIn.js
  if(keepLoggedIn == "yes") {
    currentUser = JSON.parse(localStorage.getItem('user'));
  }
  else {
    currentUser = JSON.parse(sessionStorage.getItem('user'));
  }

}

function signOutUser() {
  sessionStorage.removeItem('user');         // Clear session storage
  localStorage.removeItem('user');           // Clear local storage
  localStorage.removeItem('keepLoggedIn');   

  signOut(auth).then(() => {
    // Sign-out successful
    alert('User signed out successfully!')
    window.location = "index.html"
  }).catch((error) => {
    // Error occured
  });

}

// Sign-out function that will remove user info from local/session storage and
// sign-out from FRD



// ------------------------Set (insert) data into FRD ------------------------
function setData(userID, trial, waterSource, phLevel) {
  // Must use brackets around variable name to use it as a key
  set(ref(db, 'users/' + userID + '/data/' + trial), {
    [waterSource]: phLevel
  })
  .then(()=> {
    alert("Data stored successfully.");
  })
  .catch((error)=> {
    alert("There was an error. Error: " + error);
  })
}


// -------------------------Update data in database --------------------------
function updateData(userID, trial, waterSource, phLevel) {
  // Must use brackets around variable name to use it as a key
  update(ref(db, 'users/' + userID + '/data/' + trial), {
    [waterSource]: phLevel
  })
  .then(()=> {
    alert("Data stored successfully.");
  })
  .catch((error)=> {
    alert("There was an error. Error: " + error);
  })
}

// ----------------------Get a Datum from FRD (single data point)---------------
function getData(userID, trial, waterSource) {

  let trialVal = document.getElementById('trialVal');
  let waterSourceVal = document.getElementById('waterSourceVal');
  let phLevelVal = document.getElementById('phLevelVal');

  const dbref = ref(db);  // Firebase parameter required for 'get' 

  // Provide the path through the nodes to the data
  get(child(dbref, 'users/' + userID + '/data/' + trial)).then((snapshot)=> {
    if(snapshot.exists()){
      trialVal.textContent = trial;
      waterSourceVal.textContent = waterSource;

      // To get specific value from a key: snapshot.value()[key]
      phLevelVal.textContent = snapshot.val()[waterSource]; 
    }
    else {
      alert("No data found.")
    }
  })
  .catch((error)=> {
    alert('unsuccessful, error' + error)
  });

}

// ---------------------------- Get a Data Set -----------------------------
// Must be an async function because you need to get all of the data
// Before you can process it for a table or graph
async function getDataSet(userID, trial){

  let trialVal = document.getElementById('setTrialVal');

  trialVal.textContent = `Trial: ${trial}`;

  const waterSources = [];
  const phLevels = [];
  const tbodyEl = document.getElementById('tbody-2'); //Select <tbody> from table

  const dbref = ref(db);  // Firebase parameter required for 'get' 

  // Wait for all data to be pulled from the FRD
  // Provide path through the nodes to the data

  await get(child(dbref, 'users/' + userID + '/data/' + trial)).then((snapshot) => {
    if(snapshot.exists()){
      console.log(snapshot.val());

      snapshot.forEach(child => {
        console.log(child.key, child.val());
        // Push values to the correct arrays
        waterSources.push(child.key);
        phLevels.push(child.val());
      })
    }
    else {
      alert('No data found');
    }
  })
  .catch((error) => {
    alert('unsuccessful, error ' + error);
  });

  //Dynamically add table rows to HTML
  tbodyEl.innerHTML = '';  //Clear any existing table
  for(let i =0; i < waterSources.length; i++) {
    addItemToTable(waterSources[i], phLevels[i], tbodyEl)
  }

}

// Add an item to the table
function addItemToTable(waterSource, phLevel, tbody) {
  console.log(waterSource, phLevel);
  let tRow = document.createElement("tr") // create table row
  let td1 = document.createElement("td")  // column 1
  let td2 = document.createElement("td")  //column 2
  
  td1.innerHTML = waterSource;
  td2.innerHTML = phLevel;

  tRow.appendChild(td1);
  tRow.appendChild(td2);

  tbody.appendChild(tRow);
}

// --------------------- Delete a freshwater source's data from FRD -------------
function deleteData(userID, trial, waterSource) {
  remove(ref(db, 'users/' + userID + '/data/' + trial + '/' + waterSource))
  .then(() => {
    alert('Data removed successfully');
  })
  .catch((error) => {
    alert('unsuccessful, error: ' + error);
  });
}

// --------------------------- Home Page Loading -----------------------------
window.onload = function(){
  // ------------------------ Set Welcome Message ----------------------
  getUsername();
  if (currentUser == null) {
    userLink.innerText = "Create New Account";
    userLink.classList.replace("nav-link", "btn");
    userLink.classList.add("btn-primary");
    userLink.href = "register.html";

    signOutLink.innerText = "Sign In";
    signOutLink.classList.replace("nav-link", "btn");
    signOutLink.classList.add("btn-success");
    signOutLink.href = "signIn.html";
  }
  else {
    userLink.innerText = currentUser.firstname;
    welcome.innerText = "Welcome " + currentUser.firstname;
    userLink.classList.replace("btn", "nav-link");
    userLink.classList.add("btn-primary");
    userLink.href = "#";

    signOutLink.innerText = "Sign Out";
    signOutLink.classList.replace("btn", "nav-link");
    signOutLink.classList.add("btn-success");
    document.getElementById('signOut').onclick = function(){
      signOutUser();
    }
  }

  // Set, Update, Get, Remove Temperature Data

  // Set data
  document.getElementById('set').onclick = function() {
    const trial = document.getElementById('trial').value; 
    const waterSource = document.getElementById('waterSource').value; 
    const phLevel = document.getElementById('phLevel').value; 
    const userID = currentUser.uid;

    setData(userID, trial, waterSource, phLevel);
  };

  // Update 
  document.getElementById('update').onclick = function() {
    const trial = document.getElementById('trial').value; 
    const waterSource = document.getElementById('waterSource').value; 
    const phLevel = document.getElementById('phLevel').value; 
    const userID = currentUser.uid;

    updateData(userID, trial, waterSource, phLevel);
  };

  // Get a datum 
  document.getElementById('get').onclick = function() {
    const trial = document.getElementById('getTrial').value; 
    const waterSource = document.getElementById('getWaterSource').value; 
    const userID = currentUser.uid;

    getData(userID, trial, waterSource);
  };

  // Get a data set 
  document.getElementById('getDataSet').onclick = function() {
    const trial = document.getElementById('getSetTrial').value; 
    const userID = currentUser.uid;

    getDataSet(userID, trial);
  };

  // Delete a freshwater source's data
  document.getElementById('delete').onclick = function() {
    const trial = document.getElementById('delTrial').value; 
    const waterSource = document.getElementById('delWaterSource').value; 
    const userID = currentUser.uid;

    deleteData(userID, trial, waterSource);
  }

}


  

