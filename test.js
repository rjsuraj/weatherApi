const API_kEY = "d1845658f92b31c64bd94f06f7188c9c";


const weather = async () => {

    let city = "sri ganganagar";
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_kEY}&units=metric`)

    let data = await response.json();
    console.log(`${(data["main"]["temp"])} c`);
    console.log(`${data?.main?.temp.toFixed(2)} c`);
    // console.log(data);
}

function successCallback(position) {
    if (navigator.geolocation) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        getCityname(latitude, longitude);
    }
    else {
        console.log("geoLocation not supported by browser");
    }
}

function errorCallback(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.")
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.")
            break;
    }
}

function geoLoaction() {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback)
}

async function getCityname(latitude, longitude) {
    let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_kEY}`);

    let data = await result.json();
    console.log(data.name);
}

// weather();  

geoLoaction();
