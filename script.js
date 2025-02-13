let globolData = [] // 
let selectElemts = document.getElementById("dropdown"); // will probaly be changed to a class soon
 
let teamcontainer = document.getElementById("team-")

// run

async function app(){
    const options = getAllVariables()

    options.forEach( e => {addOption(e)})
    // globolData.forEach()

    console.log(calculateAverage(987,"Pickup_Time"))
    console.log(globolData)


}



//intailizing
fetch("/Data.json").then(e =>  { return e.json()}).then(e => { globolData = e; app();}).catch(e => {console.error(`errEr data Not Loaded:${e} `)})



// Funcions


function calculateAverage(teamNumber, variable) {
    // Find the team number by matching the team number
    const team = getTeam(teamNumber)

    // takes all values of the specified variable across rounds
    const values = team.rounds
        .map(round => parseFloat(round[variable]))
        .filter(value => !isNaN(value)); // Remove NaN values

    if (values.length === 0) {
        console.error("No valid values found for", variable);
        return null;
    }

    // Calculate the average
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
}
function getAllVariables() {
    const allVariables = new Set();
    
    globolData.forEach(team => {
        team.rounds.forEach(round => {
            Object.keys(round).forEach(key => allVariables.add(key));
        });
    });
    
    return Array.from(allVariables);
}
function getTeam(teamNumber)
{
    const team = globolData.find(team => team.team === teamNumber);
    if (!team) {
        console.error("Team not found");
        return null;
    }
    return team
}
function addOption(optionName) {
 
    let option = document.createElement("option");
    option.value = optionName;
    option.text = optionName;
    selectElemts.appendChild(option);
  }
