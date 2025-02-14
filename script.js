// Global Variables


// this is all the data ik they re empty but, if you look at the code under the init commit this function make anyrequist needed before the app starts and saves them to these vars so you can use them in any function.


let globolData = [];
let SortedList = [];
let selectElemts = document.getElementById('dropdown'); // will probaly be changed to a class soon

let teamcontainer = document.getElementById('team-container');
let dropDownContainer = document.getElementById('dropdown-container');
let dropBtn = document.getElementById('addDrop');


// API Keys
const API_KEY = 'Dawg no api key bru'; // theodore nigga please dont clone the api key to the repo

// run
async function app() {

  const options = getAllVariables();
options.forEach((e) => {
    addOption(e);
  });
  
orginize()
 
  // sets up the boilerPlate EL

  SortedList.forEach( e => {
    createTeamCard(e, teamcontainer)
  })



  // add event listener
  dropBtn.addEventListener('click', () => {
    initDropDown();
  });



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
function renderTeams() {

// takes all the 



}
function orginize()
{
  SortedList = globolData;
}

function createTeamCard(teamObj, target) {
  // Create the outer container for the team card and set its width to 300px.
  const teamObjContainer = document.createElement("div");
  teamObjContainer.className = "team-obj-container";
  teamObjContainer.style.width = "300px";
  
  // Create a wrapper for the main content and the 'more' button.
  const sep = document.createElement("div");
  sep.className = "sep";
  
  // Main section (left side) containing team info and extras.
  const mainDiv = document.createElement("div");
  
  // Create the top row (team name and total score).
  const topRow = document.createElement("div");
  topRow.className = "top";
  
  const nameSpan = document.createElement("span");
  nameSpan.className = "name";
  // Using teamObj.team for team name.
  nameSpan.textContent = teamObj.team;
  
  // Calculate total score from rounds.
  let totalScore = 0;
  teamObj.rounds.forEach(round => {
    totalScore += Number(round.Score) || 0;
  });
  
  const scoreSpan = document.createElement("span");
  scoreSpan.className = "score";
  scoreSpan.textContent = totalScore;
  
  topRow.appendChild(nameSpan);
  topRow.appendChild(scoreSpan);
  
  // Display the team number.
  const numberSpan = document.createElement("span");
  numberSpan.className = "number";
  // Change to teamObj.teamNumber if necessary.
  numberSpan.textContent = teamObj.team;
  
  // Extras container (hidden/expanded on click).
  const extras = document.createElement("div");
  extras.className = "extras";
  extras.appendChild(document.createElement("br"));
  extras.appendChild(document.createElement("hr"));
  extras.appendChild(document.createElement("br"));
  
  // Initially, collapse extras.
  extras.style.height = "0";
  extras.style.overflow = "hidden";
  
  // Create the container that holds the left (rounds) and right (stats) columns.
  const container = document.createElement("div");
  container.className = "container";
  
  // Left column: container for rounds.
  const contRounds = document.createElement("div");
  contRounds.className = "cont-rounds";
  const roundsHeader = document.createElement("h2");
  roundsHeader.textContent = "Rounds";
  contRounds.appendChild(roundsHeader);
  
  // Right column: container for stats.
  const contStats = document.createElement("div");
  contStats.className = "cont-stats";
  const statsHeader = document.createElement("h2");
  statsHeader.textContent = "Stats";
  contStats.appendChild(statsHeader);
  
  // Loop through each round in the team object.
  teamObj.rounds.forEach(round => {
    // Create and append a new round div in contRounds.
    const roundDiv = document.createElement("div");
    roundDiv.className = "round";
    roundDiv.textContent = `Round ${round.round_number}`;
    contRounds.appendChild(roundDiv);
    
    // Create a stats container for this round.
    const roundStatsContainer = document.createElement("div");
    roundStatsContainer.className = "round-stats";
    
    // Loop through every attribute in the round object.
    for (let key in round) {
      if (round.hasOwnProperty(key)) {
        // If the attribute is "scouts" (an array), loop through each scout.
        if (key === "scouts" && Array.isArray(round[key])) {
          round[key].forEach((scout, index) => {
            const scoutStat = document.createElement("div");
            scoutStat.appendChild(document.createTextNode(`Scout ${index + 1}: `));
            const scoutSpan = document.createElement("span");
            scoutSpan.textContent = scout.name;
            scoutStat.appendChild(scoutSpan);
            roundStatsContainer.appendChild(scoutStat);
          });
        } else {
          // Create a new div for the stat in the format: key: <span>value</span>
          const statItem = document.createElement("div");
          statItem.appendChild(document.createTextNode(`${key}: `));
          const statValue = document.createElement("span");
          statValue.textContent = round[key];
          statItem.appendChild(statValue);
          roundStatsContainer.appendChild(statItem);
        }
      }
    }
    
    // Append the stats container for this round to the overall stats column.
    contStats.appendChild(roundStatsContainer);
  });
  
  // Append the rounds and stats columns into the container.
  container.appendChild(contRounds);
  container.appendChild(contStats);
  
  // Assemble the main section.
  mainDiv.appendChild(topRow);
  mainDiv.appendChild(numberSpan);
  mainDiv.appendChild(extras);
  extras.appendChild(container);
  
  // Create the right side "more" button.
  const moreBtn = document.createElement("div");
  moreBtn.className = "moreBtn";
  const arrowImg = document.createElement("img");
  arrowImg.src = "/darrow.svg";
  arrowImg.width = 10;
  arrowImg.alt = "";
  moreBtn.appendChild(arrowImg);
  
  // Add a click event to the "more" button to toggle extras height.
  moreBtn.addEventListener("click", function() {
    // Toggle between collapsed (0) and expanded ("fit-content")
    if (extras.style.height === "fit-content" || extras.style.height === "auto") {
      extras.style.height = "0";
    } else {
      extras.style.height = "fit-content";
      teamObjContainer.width = "1000px"
    }
  });
  
  // Assemble the overall team card.
  sep.appendChild(mainDiv);
  sep.appendChild(moreBtn);
  teamObjContainer.appendChild(sep);
  
  // Append the card to the target container if provided.
  if (target) {
    target.appendChild(teamObjContainer);
  }
  
  return teamObjContainer;
}


