const permission = document.querySelector(".grant-permission-container");
const loading = document.querySelector(".loading-container");
const network = document.querySelector(".network-container");
const search = document.querySelector(".search-container");
const weather = document.querySelector(".weather-container");
const error = document.querySelector(".error-container");

const locationName = document.querySelector(".location-name");
const weatherType = document.querySelector(".weather-condition p");
const temprature = document.querySelector(".temp");
const windspeedVal = document.querySelector(".windspeed-value");
const humidityVal = document.querySelector(".humidity-value");
const cloudsVal = document.querySelector(".clouds-value");
const locationImg = document.querySelector(".user-location img");
const weatherImg = document.querySelector(".weather-condition img");

const weatherTab = document.querySelector(".weather-tab");
const searchTab = document.querySelector(".search-tab")
const searchInput = document.querySelector("#search-input");
const serchBtn = document.querySelector("#search-btn")
const retryBtn = document.querySelector(".retry-btn")
const networkErrorMsg = document.querySelector(".network-container p");

const permissionMsg = document.querySelector(".grant-permission-container p");
const grantBtn = document.querySelector(".grant-btn");

let tempData;


const API_kEY = "d1845658f92b31c64bd94f06f7188c9c";
let flag = true; //tracking if first time user clicked allow or block

//these function hiding and showing UI components 
function showLoadingContainer() {
    loading.classList.add("active-block");
}

function hideLoadingContainer() {
    if(loading.classList.contains("active-block"))
        loading.classList.remove("active-block");
}

function showPermissionContainer(){
    permission.classList.add("active-flex")
}

function hidePermissionContainer(){
    if(permission.classList.contains("active-flex"));
        permission.classList.remove("active-flex");
}

function showWeatherContainer(){
    weather.classList.add("active-block");
}

function hideWeatherContainer(){
    if(weather.classList.contains("active-block"))
        weather.classList.remove("active-block");
}

function showNetworkContainer(){
    network.classList.add("active-block");
}

function hideNetworkContainer(){ 
    if(network.classList.contains("active-block"))   
        network.classList.remove("active-block");
}

function showErrorContainer(){
    error.classList.add("active-block");
}

function hideErrorContainer(){ 
    if(error.classList.contains("active-block")) 
        error.classList.remove("active-block");
}

function showSearchContainer(){
    search.classList.add("active-flex");
}

function hideSearchContainer(){
    if(search.classList.contains("active-flex"))
        search.classList.remove("active-flex");
}

function hideAllContainer(){
    if(loading.classList.contains("active-block"))
        loading.classList.remove("active-block");

    if(permission.classList.contains("active-flex"));
        permission.classList.remove("active-flex")   

    if(weather.classList.contains("active-block"))
        weather.classList.remove("active-block");

    if(network.classList.contains("active-block"))   
        network.classList.remove("active-block");

    if(error.classList.contains("active-block")) 
        error.classList.remove("active-block");

    if(search.classList.contains("active-flex"))
        search.classList.remove("active-flex");
}


async function fetchUserLocation(latitude, longitude) {

    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_kEY}`);

    let data = await response.json();

    localStorage.setItem("city",`${data.name}`);
    
    fetchWeatherDetails(data.name);
}

async function fetchWeatherDetails(city) {

    try {
        showLoadingContainer();
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_kEY}&units=metric`);
        let data = await response.json();
    
        renderWhetherInfo(data);
        
    } catch (error) {
        if((error.message).includes("Cannot read properties of undefined")){
            hideLoadingContainer();
            showErrorContainer();
        }
        else{
            networkErrorMsg.textContent = `Error: ${error.message}`
            hideLoadingContainer();
            showNetworkContainer();
        }
    }
}

function getUserLocation() {

    //if user didn't block the request first time
    if(flag){
        hidePermissionContainer();
        showLoadingContainer();
        navigator.geolocation.getCurrentPosition(
            function (position){
                if (navigator.geolocation) {
                    fetchUserLocation(position.coords.latitude,position.coords.longitude)
                }
                else {
                    alert("Geoloacation is not supported by browser");
                }
            },
    
            function (e){
                flag = false;  //user selected block 
                hideLoadingContainer();
                switch (e.code) {
                    case e.PERMISSION_DENIED:
                        permissionMsg.textContent = "you denied the request for Geolocation.";
                        break;
                    case e.POSITION_UNAVAILABLE:
                        permissionMsg.textContent = "Location information is unavailable.";
                        break;
                    case e.TIMEOUT:
                        permissionMsg.textContent = "The request to get user location timed out.";
                        break;
                }
                showPermissionContainer();
            }
        
        ); 
    }
}



function renderWhetherInfo(weatherData){


    locationName.textContent = weatherData.name;

    weatherType.textContent = weatherData["weather"][0]["main"];

    temprature.textContent = `${weatherData["main"]["temp"]}°C`;

    windspeedVal.textContent = `${weatherData["wind"]["speed"]}m/s`;

    humidityVal.textContent = `${weatherData["main"]["humidity"]}%`;

    cloudsVal.textContent = `${weatherData["clouds"]["all"]}%`;

    let cityName = weatherData["sys"]["country"];
    cityName = cityName.toLowerCase();
    
    locationImg.src =`https://flagcdn.com/144x108/${cityName}.png` ;

    weatherImg.src = `https://openweathermap.org/img/w/${weatherData["weather"][0]["icon"]}.png`;

    hideLoadingContainer();
    showWeatherContainer();
}



// main program starts here
if(!localStorage.getItem("city"))
    showPermissionContainer();

window.addEventListener("load",()=>{
    if(localStorage.getItem("city")){
        fetchWeatherDetails(localStorage.getItem("city"));
    }
})


grantBtn.addEventListener("click",getUserLocation)

searchTab.addEventListener("click",()=>{
    if(!search.classList.contains("active-flex")){
        searchTab.classList.add("current-tab");
        weatherTab.classList.remove("current-tab");
        searchInput.value = "";
        hideAllContainer();
        showSearchContainer();
    }
})

weatherTab.addEventListener("click",()=>{
    if(search.classList.contains("active-flex")){
        searchTab.classList.remove("current-tab");
        weatherTab.classList.add("current-tab");
        hideAllContainer();
        fetchWeatherDetails(localStorage.getItem("city"))
    }
})

serchBtn.addEventListener("click",()=>{
    let searchedLocation = searchInput.value;
    if(searchedLocation){
        hideWeatherContainer();
        hideErrorContainer();
        fetchWeatherDetails(searchedLocation);
    }
})

searchInput.addEventListener("keydown",(e)=>{
    if(e.keyCode === 13){
        let searchedLocation = searchInput.value;
        if(searchedLocation){
            hideWeatherContainer();
            hideErrorContainer();
            fetchWeatherDetails(searchedLocation);
        }
    }
})

retryBtn.addEventListener("click",()=>{

    hideNetworkContainer();
    if(search.classList.contains("active-flex"))
        fetchWeatherDetails(searchInput.value);
    else
        fetchWeatherDetails(localStorage.getItem("city"));
})


