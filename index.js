async function get1() { 

    const response = await fetch('http://ergast.com/api/f1/2022/drivers.json'); 


    var data = await response.json();

    const driverArray = data.MRData.DriverTable.Drivers;

    for (let i=0; i< driverArray.length; i++) {
        const para = document.createElement("p");
        para.innerHTML = driverArray[i].driverId;
        document.getElementById("main").appendChild(para);
    }
}

async function get2() {
    const response = await fetch('http://ergast.com/api/f1/current.json'); 

    var data = await response.json();

    const racesArray = data.MRData.RaceTable.Races;
    console.log(data.MRData.RaceTable.Races);
    for (let i=0; i< racesArray.length; i++) {
        const para = document.createElement("p");
        para.innerHTML = racesArray[i].raceName;
        document.getElementById("main").appendChild(para);
    }
}

async function get3() {
    const response = await fetch('http://ergast.com/api/f1/2022/4/results.json'); 

    var data = await response.json();

    console.log(data);
     
}