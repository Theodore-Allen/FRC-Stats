// Global Variables
let globolData = [];
let SortedList = [];
let selectElemts = document.getElementById('dropdown'); // will probaly be changed to a class soon

let teamcontainer = document.getElementById('team');
let dropDownContainer = document.getElementById('dropdown-container');
let dropBtn = document.getElementById('addDrop');

// API Keys
const API_KEY =
  'Dawg no api key bru'; // theodore nigga please dont clone the api key to the repo

// run
async function app() {
  console.log('heklo world');
  const options = getAllVariables();
  // sets up the boilerPlate EL
  options.forEach((e) => {
    addOption(e);
  });
  initDropDown();

  // add event listener
  dropBtn.addEventListener('click', () => {
    initDropDown();
  });
  // globolData.forEach()

  console.log(calculateAverage(987, 'Pickup_Time'));
  console.log(globolData);
}

// Fetches the JSON
fetch('/Data.json')
  .then((e) => {
    return e.json();
  })
  .then((e) => {
    globolData = e;
    app();
  })
  .catch((e) => {
    console.error(`errEr data Not Loaded:${e} `);
  });

// Funcions
function calculateAverage(teamNumber, variable) {
  // Find the team number by matching the team number
  const team = getTeam(teamNumber);

  // takes all values of the specified variable across rounds
  const values = team.rounds
    .map((round) => parseFloat(round[variable]))
    .filter((value) => !isNaN(value)); // Remove NaN values

  if (values.length === 0) {
    console.error('No valid values found for', variable);
    return null;
  }

  // Calculate the average
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

function getAllVariables() {
  const allVariables = new Set();

  globolData.forEach((team) => {
    team.rounds.forEach((round) => {
      Object.keys(round).forEach((key) => allVariables.add(key));
    });
  });

  return Array.from(allVariables);
}

function getTeam(teamNumber) {
  const team = globolData.find((team) => team.team === teamNumber);
  if (!team) {
    console.error('Team not found');
    return null;
  }
  return team;
}

function addOption(optionName) {
  let option = document.createElement('option');
  option.value = optionName;
  option.text = optionName;
  selectElemts.appendChild(option);
}

function initDropDown() {
  let clone = selectElemts.cloneNode(true);
  let div = document.createElement('div');
  clone.addEventListener('change', (e) => {
    const target = e.target;
    if (target.value == 0) return target.remove();
  });
  div.appendChild(clone);
  dropDownContainer.appendChild(div);
}

// fetching outside data

function apiStatus() {
  const apiTestUrl = 'https://www.thebluealliance.com/api/v3/status';

  fetch(apiTestUrl, {
    method: 'GET',
    headers: {
      'X-TBA-Auth-Key': API_KEY,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error('Error:', error));
}

// add the team rending
// which js makes all the teams show up based off the filtered list '


// and pls 
function renderTeams() {}




