const teamColors = [['ferrari', '#A6051A'], ['red_bull', '#0600EF'], ['mercedes', '	#00D2BE'], ['mclaren', '#FF8700'], ['alpine', '#0090FF'], ['alfa', '#900000'], ['haas', '	#FFFFFF'], ['alphatauri', '	#2B4562'], ['williams', '#005AFF'], ['aston_martin', '	#006F62']];

async function get2() {
    const response = await fetch('http://ergast.com/api/f1/current/driverStandings.json');
    var drivers = await response.json();

    var driverStandings = drivers.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    const list = document.getElementById("presentList").getElementsByTagName("li");

    for (let i=0; i < 10; i++) {
        const lname = driverStandings[i].Driver.familyName;
        const fname = driverStandings[i].Driver.givenName;
        const constructor = driverStandings[i].Constructors[0].constructorId;
        var color = getConstructor(constructor);
        console.log(color);
        var name = (i+1) + ". " + fname + " " + lname;
        list[i].innerHTML = name;
        list[i].style.backgroundColor = color;
    }
}


function getConstructor (constructor) {
    console.log(constructor);
    for (let i=0; i < 10; i++) {
        if (teamColors[i][0] === constructor) {
            return teamColors[i][1];
        }
    }
}









async function getCurrentStandings () {
    const response = await fetch('http://ergast.com/api/f1/current/constructorStandings.json');
    const response1 = await fetch('http://ergast.com/api/f1/current/driverStandings.json');

    var construct = await response.json();
    var drivers = await response1.json();

    var constructorStandings = construct.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
    var driverStandings = drivers.MRData.StandingsTable.StandingsLists[0].DriverStandings;

    console.log(driverStandings);

    for (let i=0; i < constructorStandings.length; i++) {
        console.log(constructorStandings[i].Constructor.name);
    }

    for (let i=0; i < driverStandings.length; i++) {
        const lname = driverStandings[i].Driver.familyName;
        const fname = driverStandings[i].Driver.givenName;
        const para = document.createElement("p");
        para.innerHTML = (i+1) + ". " + fname + " " + lname;
        document.getElementById("main").appendChild(para);
    }

}