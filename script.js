const API_KEY = '44075a32f672ec2db64a13fd33561e80';

let searchTab = document.querySelector('[searchWeather]');
let userTab = document.querySelector('[userWeather]');
let locationTab = document.querySelector('[locationScreen]');
const searchScreen = document.querySelector('[searchForm]');
const loadScreen = document.querySelector('[loadingScreen]');
const userScreen = document.querySelector('[userScreen]');
let currentTab = userTab;
currentTab.classList.add("tabColor");
showCurrentLocation();
function switchTab(newTab) {
    if (currentTab != newTab) {
        console.log(newTab);
        currentTab.classList.remove("tabColor");
        currentTab = newTab;
        currentTab.classList.add("tabColor")

        // Tab Switching
        if (!searchScreen.classList.contains("active")) {
            searchScreen.classList.add('active');
            userScreen.classList.remove("active");
            locationTab.classList.remove("active")
            console.log(searchScreen, userScreen, locationTab);
        }
        else {
            searchScreen.classList.remove('active');
            userScreen.classList.remove("active");
            showCurrentLocation();
        }
    }
}
userTab.addEventListener('click', () => {
    switchTab(userTab);
    console.log(userTab);
});
searchTab.addEventListener('click', () => {
    switchTab(searchTab);
});
function showCurrentLocation() {
    console.log("I am started");
    let currenLocation = JSON.parse(sessionStorage.getItem("user-cords"));
    if (!currenLocation) {
        locationTab.classList.add("active")
        console.log("I am in if");
    }
    else {
        fetchUserWeather(currenLocation);
    }
}


// User Location

let grantAcess = document.querySelector('[grantAcess]');
function showPosition(position) {
    locationTab.classList.remove("active");
    let userCords = {
        lat: position.coords.latitude,
        longi: position.coords.longitude,
    }
    sessionStorage.setItem("user-cords", JSON.stringify(userCords));
    fetchUserWeather(userCords);
};

grantAcess.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert("Gelocation is not supported");
    }
});
async function fetchUserWeather(location) {
    let lat = location.lat;
    let lon = location.longi;
    console.log(lat, lon);
    console.log(loadScreen)
    loadScreen.classList.add("active");
    try {
        console.log("Trying to fetch");
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json()
        loadScreen.classList.remove("active");
        userScreen.classList.add('active');
        renderWeather(data)
    }
    catch (e) {
        console.log("unable to fetch");
        alert('Unable to fetch' + e)
    }
}

function renderWeather(data) {
    console.log('I am rendering')
    let cityName = document.querySelector("[cityName]");
    let countryFlag = document.querySelector("[countryFlag]");
    let weatherDesc = document.querySelector("[weatherDesc]");
    let weatherIcon = document.querySelector("[weatherIcon]");
    let weatherTemp = document.querySelector("[weatherTemp]");
    let windValue = document.querySelector('[windValue]');
    let cloudValue = document.querySelector('[cloudValue]');
    let humidityValue = document.querySelector('[humidityValue]');
    // Filling values 
    console.log(data)
    cityName.innerText = data?.name;
    countryFlag.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = data?.weather[0].description;
    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`
    weatherTemp.innerText = data?.main?.temp;
    windValue.innerText = data?.wind?.speed;
    cloudValue.innerText = data?.clouds?.all + "%";
    humidityValue.innerText = data?.main?.humidity + "%";
    console.log('rendering Completed')

}

// Search Weather

const searchText = document.querySelector('[searchText]');
const searchBtn = document.querySelector('[searchBtn]');
searchText.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        searchWeather();
    }
})
searchBtn.addEventListener('click', searchWeather)
async function searchWeather() {
    let cityName = searchText.value;
    if (cityName === '') return;
    else {
        try {
            loadScreen.classList.add("active");
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`);
            let data = await response.json()
            loadScreen.classList.remove("active");
            userScreen.classList.add('active')
            renderWeather(data);
        }
        catch (e) {
            alert('Unable to find city weather' + e);
        }
    }
}