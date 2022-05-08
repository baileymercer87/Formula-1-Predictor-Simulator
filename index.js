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
