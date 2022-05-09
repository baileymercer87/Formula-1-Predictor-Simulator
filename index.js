const teamColors = [['ferrari', '#A6051A'], ['red_bull', '#0600EF'], ['mercedes', '	#00D2BE'], ['mclaren', '#FF8700'], ['alpine', '#0090FF'], ['alfa', '#900000'], ['haas', '#DBDBDB'], ['alphatauri', '	#2B4562'], ['williams', '#005AFF'], ['aston_martin', '	#006F62']];

async function get2() {
    const response = await fetch('http://ergast.com/api/f1/current/driverStandings.json');
    var drivers = await response.json();

    var driverStandings = drivers.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    const list = document.getElementById("presentList");

    for (let i=0; i < 10; i++) {
        const lname = driverStandings[i].Driver.familyName;
        const fname = driverStandings[i].Driver.givenName;
        const constructor = driverStandings[i].Constructors[0].constructorId;

        var color = getConstructor(constructor);
        const item = document.createElement("li");
        var name = (i+1) + ". " + fname + " " + lname;
        item.innerHTML = name;
        item.style.backgroundColor = color;
        list.appendChild(item);
    }
}


function getConstructor (constructor) {
    for (let i=0; i < 10; i++) {
        if (teamColors[i][0] === constructor) {
            return teamColors[i][1];
        }
    }
}


async function loadTracks () {

    const response = await fetch ('http://ergast.com/api/f1/2022/circuits.json');

    const data = await response.json();

    const circuits = data.MRData.CircuitTable.Circuits;

    for (let i=0; i < circuits.length; i++) {

        const circuit = circuits[i].circuitName;

        const item = document.createElement("option");
        item.value = circuits[i].circuitId;
        item.innerHTML = circuit;
        document.getElementById("trackOption").appendChild(item);
    }
}


async function getDriverStandings (driversList) {
    driverStand = [];
    const response = await fetch('http://ergast.com/api/f1/current/driverStandings.json');

    var drivers = await response.json();

    var driverStandings = drivers.MRData.StandingsTable.StandingsLists[0].DriverStandings;

    for (let i=0; i < driverStandings.length; i++) {
        for (let x=0; x < driversList.length; x++) {
            if (driversList[x][0] === driverStandings[i].Driver.driverId) {
                driversList[x].push(driverStandings[i].position) 
                driversList[x].push(driverStandings[i].points);
                driversList[x].push(driverStandings[i].Constructors[0].constructorId);
            }
        }
    }
    return driverList;

}

async function getConstructorStandings (driversList) {
    constructStand = [];

    const response = await fetch('http://ergast.com/api/f1/current/constructorStandings.json');

    var construct = await response.json();

    var constructorStandings = construct.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;

    for (let i=0; i < constructorStandings.length; i++) {
        for (let x=0; x < driversList.length; x++) {
            if (driversList[x][5] === constructorStandings[i].Constructor.constructorId) {
                driversList[x].push(constructorStandings[i].position);
                driversList[x].push(constructorStandings[i].points);
            }
        }
    }
    return driversList;
}

async function getDriversList () {
    driverList = [];
    const response = await fetch('http://ergast.com/api/f1/current/driverStandings.json');

    var drivers = await response.json();

    var driverStandings = drivers.MRData.StandingsTable.StandingsLists[0].DriverStandings;

    for (let i=0; i < driverStandings.length; i++) {
        if (driverStandings[i].Driver.code !== "HUL") {
            driverList.push([driverStandings[i].Driver.driverId, driverStandings[i].Driver.givenName, driverStandings[i].Driver.familyName]);
        }
    }
    return driverList;
}

async function predictRace () {

    let driversList = await getDriversList();
    
    driversList = await getDriverStandings(driversList);
    console.log(driversList);

    driversList = await getConstructorStandings(driversList);
    console.log(driversList);

    //const allDriverStandings = getAllDriverStandings();
    //const allConstructorStandings = getAllConstructorStandings();

    const seasonResults = getSeasonResults();
    const previousTrackResults = getPreviousRaces ();

    const crashes = getSeasonCrashes();
    const allCrashes = getAllCrashes();

    const weather = getWeather();
}


//format = [driver ID, first name, last name, driver standing pos, driver points, constructor id, constructor standing pos, constructor points]