// Global Variables
let globalData = [];
let sortedList = [];
const selectElements = document.getElementById('dropdown'); // may be changed to a class soon
const teamContainer = document.getElementById('team-container');
const dropDownContainer = document.getElementById('dropdown-container');
const dropBtn = document.getElementById('addDrop');

// API Keys
const API_KEY = 'Dawg no api key bru'; // theodore nigga please dont clone the api key to the repo

// Main application function
async function app() {
  const options = getAllVariables();
  options.forEach((option) => {
    addOption(option);
  });

  organize();

  // Render team cards for each team in sortedList
  sortedList.forEach((teamObj) => {
    createTeamCard(teamObj, teamContainer);
  });

  // Add event listener for dropdown button
  dropBtn.addEventListener('click', () => {
    initDropDown();
  });
}

// Fetch JSON data and then run the app
fetch('/Data.json')
  .then((response) => response.json())
  .then((data) => {
    globalData = data;
    app();
  })
  .catch((error) => {
    console.error(`Error: Data not loaded: ${error}`);
  });

// Functions

// calculateAverage safely handles non-numeric values
function calculateAverage(teamNumber, variable) {
  const team = getTeam(teamNumber);
  if (!team) return null;

  const values = [];
  team.rounds.forEach((round) => {
    let value = round[variable];
    if (typeof value === 'number') {
      values.push(value);
    } else if (typeof value === 'string') {
      const parsed = parseFloat(value);
      if (!isNaN(parsed)) {
        values.push(parsed);
      }
    }
  });

  if (values.length === 0) {
    console.error(
      `No valid numeric values for variable "${variable}" in team ${teamNumber}`
    );
    return null;
  }

  const sum = values.reduce((acc, cur) => acc + cur, 0);
  return sum / values.length;
}

// Collect all unique variables from the dataset
function getAllVariables() {
  const allVariables = new Set();
  globalData.forEach((team) => {
    team.rounds.forEach((round) => {
      Object.keys(round).forEach((key) => allVariables.add(key));
    });
  });
  return Array.from(allVariables);
}

// Retrieve a team object by its team number
function getTeam(teamNumber) {
  const team = globalData.find((team) => team.team === teamNumber);
  if (!team) {
    console.error('Team not found');
    return null;
  }
  return team;
}

// Add an option to the dropdown
function addOption(optionName) {
  const option = document.createElement('option');
  option.value = optionName;
  option.text = optionName;
  selectElements.appendChild(option);
}

// Initialize a new dropdown element
function initDropDown() {
  const clone = selectElements.cloneNode(true);
  const div = document.createElement('div');
  clone.addEventListener('change', (e) => {
    if (e.target.value == 0) {
      e.target.remove();
    }
  });
  div.appendChild(clone);
  dropDownContainer.appendChild(div);
}

// Check API status from an external source
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

// Organize data into sortedList (add sorting logic as needed)
function organize() {
  sortedList = globalData;
}

// Create a team card element with clickable rounds and an averages column.
// The rounds column uses class "cont-rounds" and the averages column uses "cont-stats" so that they share equal space.
function createTeamCard(teamObj, target) {
  // Outer container for the team card
  const teamObjContainer = document.createElement('div');
  teamObjContainer.className = 'team-obj-container';

  // Wrapper for main content and the "more" button
  const sep = document.createElement('div');
  sep.className = 'sep';

  // Main section (team header and expandable extras)
  const mainDiv = document.createElement('div');

  // Top row with team name and total score
  const topRow = document.createElement('div');
  topRow.className = 'top';

  const nameSpan = document.createElement('span');
  nameSpan.className = 'name';
  nameSpan.textContent = teamObj.team;

  // Calculate total score from rounds (using Score property)
  let totalScore = 0;
  teamObj.rounds.forEach((round) => {
    totalScore += Number(round.Score) || 0;
  });
  const scoreSpan = document.createElement('span');
  scoreSpan.className = 'score';
  scoreSpan.textContent = totalScore;

  topRow.appendChild(nameSpan);
  topRow.appendChild(scoreSpan);

  // Display the team number
  const numberSpan = document.createElement('span');
  numberSpan.className = 'number';
  numberSpan.textContent = teamObj.team;

  // Extras container (hidden/expanded on clicking the "more" button)
  const extras = document.createElement('div');
  extras.className = 'extras';
  extras.style.height = '0';
  extras.style.overflow = 'hidden';

  // Flex container for rounds and averages columns (CSS will handle the 1:1 layout)
  const flexContainer = document.createElement('div');
  flexContainer.className = 'container';

  // Rounds Column (using same class as before: "cont-rounds")
  const roundsColumn = document.createElement('div');
  roundsColumn.className = 'cont-rounds';
  const roundsHeader = document.createElement('h2');
  roundsHeader.textContent = 'Rounds';
  roundsColumn.appendChild(roundsHeader);

  // For each round, create a clickable element
  teamObj.rounds.forEach((round) => {
    const roundDiv = document.createElement('div');
    roundDiv.className = 'round';
    roundDiv.style.cursor = 'pointer';

    // Header for the round
    const roundHeader = document.createElement('div');
    roundHeader.textContent = `Round ${round.round_number}`;
    roundHeader.style.fontWeight = 'bold';
    roundDiv.appendChild(roundHeader);

    // Hidden details for non-numeric data
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'round-details';
    detailsContainer.style.display = 'none';
    detailsContainer.style.marginTop = '5px';

    // Loop through each property of the round
    for (let key in round) {
      if (round.hasOwnProperty(key)) {
        if (key === 'round_number') continue;
        if (key === 'scouts' && Array.isArray(round[key])) {
          round[key].forEach((scout, index) => {
            const scoutDetail = document.createElement('div');
            scoutDetail.textContent = `Scout ${index + 1}: ${scout.name}`;
            detailsContainer.appendChild(scoutDetail);
          });
        } else {
          // Only display non-numeric details
          let value = round[key];
          let numeric = false;
          if (typeof value === 'number') {
            numeric = true;
          } else if (typeof value === 'string') {
            const parsed = parseFloat(value);
            if (!isNaN(parsed)) {
              numeric = true;
            }
          }
          if (!numeric) {
            const detailItem = document.createElement('div');
            detailItem.textContent = `${key}: ${value}`;
            detailsContainer.appendChild(detailItem);
          }
        }
      }
    }
    roundDiv.appendChild(detailsContainer);

    // Toggle details on clicking the round
    roundDiv.addEventListener('click', () => {
      detailsContainer.style.display =
        detailsContainer.style.display === 'none' ? 'block' : 'none';
    });

    roundsColumn.appendChild(roundDiv);
  });

  // Averages Column (use class "cont-stats" to match your existing CSS)
  const avgColumn = document.createElement('div');
  avgColumn.className = 'cont-stats';
  const avgHeader = document.createElement('h2');
  avgHeader.textContent = 'Averages';
  avgColumn.appendChild(avgHeader);

  // Gather all unique keys from the team's rounds and compute averages
  const keys = new Set();
  teamObj.rounds.forEach((round) => {
    Object.keys(round).forEach((key) => keys.add(key));
  });

  keys.forEach((key) => {
    const avg = calculateAverage(teamObj.team, key);
    if (avg !== null) {
      const avgDiv = document.createElement('div');
      avgDiv.textContent = `${key}: ${avg.toFixed(2)}`;
      avgColumn.appendChild(avgDiv);
    }
  });

  // Append rounds and averages columns to the flex container
  flexContainer.appendChild(roundsColumn);
  flexContainer.appendChild(avgColumn);
  extras.appendChild(flexContainer);

  // Assemble the main team card section
  mainDiv.appendChild(topRow);
  mainDiv.appendChild(numberSpan);
  mainDiv.appendChild(extras);

  // "More" button to toggle the extras drop-down for the whole team card
  const moreBtn = document.createElement('div');
  moreBtn.className = 'moreBtn';
  moreBtn.style.cursor = 'pointer';
  const arrowImg = document.createElement('img');
  arrowImg.src = '/darrow.svg';
  arrowImg.width = 10;
  arrowImg.alt = '';
  moreBtn.appendChild(arrowImg);

  moreBtn.addEventListener('click', () => {
    if (
      extras.style.height === 'fit-content' ||
      extras.style.height === 'auto'
    ) {
      extras.style.height = '0';
      teamObjContainer.style.width = '320px';
    } else {
      extras.style.height = 'fit-content';
      teamObjContainer.style.width = '100%';
    }
  });

  sep.appendChild(mainDiv);
  sep.appendChild(moreBtn);
  teamObjContainer.appendChild(sep);

  if (target) {
    target.appendChild(teamObjContainer);
  }
  return teamObjContainer;
}
