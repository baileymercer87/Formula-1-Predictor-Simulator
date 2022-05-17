const teamColors = [['ferrari', '#A6051A'], ['red_bull', '#0600EF'], ['mercedes', '	#00D2BE'], ['mclaren', '#FF8700'], ['alpine', '#0090FF'], ['alfa', '#900000'], ['haas', '#DBDBDB'], ['alphatauri', '	#2B4562'], ['williams', '#005AFF'], ['aston_martin', '	#006F62']];

const weather_API_Key = '7747a50bf9db18f84cab124985c87878';

async function loadLeaderboard() {
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
    var track = document.getElementById("trackOption");
    var selectedTrack = track[0].innerHTML;
    document.getElementById("trackTitle").innerHTML = selectedTrack;
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

async function getSeasonResults (driversList) {
    for (let i=0;i < driversList.length; i++) {
        const response = await fetch('http://ergast.com/api/f1/current/drivers/'+driversList[i][0]+ '/results.json');
        var driver = await response.json();
        var driverResults = driver.MRData.RaceTable.Races;
        driverList[i][8] = [];
        for (let x=0; x < driverResults.length; x++) {
            if (driverResults[x].Results[0].position < 16) {
                driversList[i][8].push(driverResults[x].Results[0].position);
            }
        }
    }
    return driversList;
}

async function getPreviousRaces (driversList) {
    var year = 2017;
    var track = document.getElementById("trackOption");
    var selectedTrack = track.value;
    for (let i=0; i < 5; i++) {
        const response = await fetch('https://ergast.com/api/f1/' + year + '/circuits/' + selectedTrack +'/results.json');
        const race = await response.json();
        year = year + 1;
        if (race.MRData.RaceTable.Races[0] !== undefined){
            const results = race.MRData.RaceTable.Races[0].Results;
            for (let x=0; x < driversList.length; x++) {
                if (driversList[x][9] === undefined){
                    driversList[x][9] = [];
                }
                for (let y=0; y < results.length; y++) {
                    if (results[y].Driver.driverId === driversList[x][0]){
                        driversList[x][9].push(results[y].position);
                    }
                }
            }
        }
    }
    return driverList;
}

async function getSeasonCrashes (driversList) {
    for (let i=0; i < driversList.length; i++) {
        driversList[i][10] = 0;
        const response = await fetch('https://ergast.com/api/f1/2022/drivers/' + driversList[i][0] +'/status.json');
        const crashes = await response.json()
        for (let x=0; x < crashes.MRData.StatusTable.Status.length; x++) {
            if (crashes.MRData.StatusTable.Status[x].statusId !== '1') {
                if (crashes.MRData.StatusTable.Status[x].statusId !== '11') {
                    driversList[i][10] = driversList[i][10] + parseInt(crashes.MRData.StatusTable.Status[x].count);
                }
            }
        }
    }
    return driversList
}

function calculateAverage (drivers) {
    for (let i=0; i < drivers.length; i++){
        let average = 0;
        const lengthResults = (drivers[i][8].length * 2);
        let lengthTrack = 0
        if (drivers[i][9]) {
            lengthTrack = (drivers[i][9].length);
            for (let y=0; y < drivers[i][9].length; y++) {
                average = average + parseInt(drivers[i][9][y]);
            }
        } 
        const length = lengthResults + lengthTrack;
        for (let x=0; x < drivers[i][8].length; x++) {
            average = average + parseInt(drivers[i][8][x]);
            average = average + parseInt(drivers[i][8][x]);
        }
        average = average / length;
        drivers[i][11] = average.toFixed(2);
        console.log(drivers[i][0] + ": " + drivers[i][11]);
    }
    return drivers;
}

function calculatePointsModifier(drivers) {
    for (let i =0; i < drivers.length; i++) {
        const driverPoints = parseInt(drivers[i][4]) / 100;
        const modifier = parseFloat('1.' + driverPoints)
        const newValue = drivers[i][11] * (2 - modifier);
        drivers[i][11] = newValue.toFixed(2);

        const constructorPoints = parseInt(drivers[i][7]) / 100
        const constructorModifier = parseFloat('1.' + constructorPoints)
        const newConstValue = drivers[i][11] * (2 - constructorModifier);
        drivers[i][11] = newConstValue.toFixed(2);
    }
    return drivers;
}

function crashModifier (drivers) {
    for (let i=0; i < drivers.length; i++) {
        const modifierValue = parseFloat("1.0" + (drivers[i][10] *2))
        const newValue = drivers[i][11] * modifierValue
        drivers[i][11] = newValue.toFixed(2);
    }
    return drivers;
}


function simulateRace (drivers) {
    for (let i=0; i < drivers.length; i++) {
        const number = randomInt(80, 120);
        let randomMultiplier = 0;
        if (number > 99) {
            randomMultiplier = parseFloat('1.' + number);
        } else {
            randomMultiplier = parseFloat('0.' + number);
        }
        const finalTime = drivers[i][11] * randomMultiplier;
        drivers[i][11] = finalTime.toFixed(2);

        const crashNumber = randomInt(0, 100);
        const crashValue = 8 + (drivers[i][10] * 3);

        if (crashNumber < crashValue) {
            drivers[i][11] = '0';
        }
    }
    return drivers;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}


async function getWeather (driversList, city) {
    const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + weather_API_Key)
    const data = await response.json();
    console.log(data);
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp } = data.main;
    const { speed } = data.wind;
    console.log(name + icon + description + temp + speed);

    let elements = document.getElementsByClassName('weather');
    console.log(elements);
    for (let i=0; i < elements.length; i++){ 
        elements[i].innerHTML = "";
        const iconURL = 'http://openweathermap.org/img/wn/' + icon + '@2x.png'
        const item = document.createElement("img");
        item.src = iconURL;
        elements[i].appendChild(item);
        const temperature = document.createElement("p");
        temperature.innerHTML = temp;
        elements[i].appendChild(temperature);
    }
}


function updateInterface(i, result) {      
    setTimeout(function() {   
        const list = document.getElementById("presentList"); 
        
        const fname = result[i][0];
        const lname = result[i][1];
        const constructor = result[i][2];

        var color = getConstructor(constructor);
        const item = document.createElement("li");
        var name = (i+1) + ". " + fname + " " + lname;
        item.innerHTML = name;
        item.style.backgroundColor = color;
        list.appendChild(item);
        i++;             
        if (i < 10) {    
            updateInterface(i, result);            
        }                       
    }, 500)
    }

async function predictRace () {

    let driversList = await getDriversList();

    driversList = await getDriverStandings(driversList);

    driversList = await getConstructorStandings(driversList);

    driversList = await getSeasonResults(driversList);

    driversList = await getPreviousRaces (driversList);

    driversList = await getSeasonCrashes(driversList);

    //const weather = getWeather();
    driversList = calculateAverage(driversList);
    
    driversList = calculatePointsModifier(driversList);

    driversList = crashModifier(driversList);

    driversList = simulateRace(driversList);

    driversList.sort(function(a,b) {
        return a[11]-b[11]
    });
    console.log(driversList);
    const notCrashed = []
    const crashed = []

    for (i=0; i < driversList.length; i++) {
        if (driversList[i][11] === '0') {
            crashed.push([driversList[i][1], driversList[i][2], driversList[i][5], 'Crashed']);
        }
        else {
            notCrashed.push([driversList[i][1], driversList[i][2], driversList[i][5], 'Not Crashed']);
        }
    }
    const finalResult = notCrashed.concat(crashed);

    const list = document.getElementById("presentList");
    list.innerHTML = "";

    updateInterface(0, finalResult);

    getWeather(driversList, 'miami');
}



//format = [driver ID, 0
//first name, 1
//last name, 2
    //driver standing pos, 3
    //driver points, 4
//constructor id, 5
    //constructor standing pos, 6
    //constructor points, 7
    //array of season results, 8
    //array of previous track, 9
//num of crashes, 10  


