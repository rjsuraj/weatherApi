const loading = document.querySelector(".loading-container");
const permission = document.querySelector(".grant-permission-container");
const permissionMsg = document.querySelector(".grant-permission-container p");
const grantBtn = document.querySelector(".grant-btn");



const API_kEY = "d1845658f92b31c64bd94f06f7188c9c";
let flag = true; //tracking if first time user clicked allow or block


function startLoading() {
    loading.classList.add("active-block");
}

function removeLoading() {
    loading.classList.remove("active-block");
}

function showPermissionPage(){
    permission.classList.add("active-flex")
}

function hidePermissionPage(){
    permission.classList.remove("active-flex");
}

async function fetchUserLocation(latitude, longitude) {

    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_kEY}`);

    let data = await response.json();

    localStorage.setItem("city",`${data.name}`);
    
    fetchWeatherDetails(data.name);
}

async function fetchWeatherDetails(city) {

    startLoading();
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_kEY}&units=metric`);
    let data = await response.json();

    removeLoading();
    console.log(data);
}

function getUserLocation() {

    //if user didn't block the request first time
    if(flag){
        hidePermissionPage();
        startLoading();
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
                removeLoading();
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
                showPermissionPage();
            }
        
        ); 
    }
}




grantBtn.addEventListener("click",getUserLocation)
window.addEventListener("load",()=>{
    if(localStorage.getItem("city")){
        hidePermissionPage();
        startLoading();
        getUserLocation();
    }
})

