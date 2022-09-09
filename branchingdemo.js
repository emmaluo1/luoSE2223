// Filename: branchingDemo.js
// Author: Emma Luo
//Objective: Demonstrate how to use GitHub branches

const months = ["January","February","March","April",
"May","June","July","August",
"September","October","November","December"]

const d = new Date();

// getMonth() returns the month as an integer (0-11). Jan = 0, Dec = 11
let month = months[d.getMonth()]

console.log("The date is: " + d)