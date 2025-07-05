const ApiKey = "3e48290586324d15bd4194300240808";
const BaseUrl = "https://api.weatherapi.com/v1";

// get location from user
let userLocation;
window.addEventListener("load", () => {
    getWeatherData("cairo");
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                userLocation = `${lat},${lon}`;
                getWeatherData(userLocation);
            },
            (error) => {
                console.log("User denied location, fallback to default city.");
            }
        );
    } else {
        console.log("Geolocation not supported, using default location.");
    }
});

// get location from user Input search 
let timeout;
document.getElementById("searchInput").addEventListener("keyup", (e) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        let searchInput = encodeURIComponent(e.target.value.trim());
        if (searchInput === "") {
            searchInput = userLocation;
        }
        getWeatherData(searchInput);
    }, 900);
});


// Function to get weather data from the API
async function getWeatherData(location = "cairo") {
    const Url = `${BaseUrl}/forecast.json?key=${ApiKey}&q=${location}&days=3&aqi=no&alerts=no`;
    try {
        const response = await fetch(Url, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`HTTP error! Message: ${data.error}`);
        }
        else {
            document.getElementById("preloader").style.display = "none";
        }

        console.log(data);
        

        displayCurrentData(data);
        displayNextDayData(data);
        displayAfterDayData(data);
        displayWeatherDetails(data);
        backgroundChanger(data)

    } catch (error) {
        console.error(error.message);
    }


}


// Function to display current weather data
function displayCurrentData(data) {
    const currentTemp = document.getElementById("current-temp");
    const location = document.getElementById("location");
    const time = document.getElementById("time");
    const moodIcon = document.getElementById("mood-icon");
    const currentMood = document.getElementById("current-mood");

    let date = new Date().toLocaleString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour12: true, hour: "numeric", minute: "numeric", });

    currentTemp.innerText = data.current.temp_c + "°";
    location.innerText = data.location.name + ", " + data.location.region + ", " + data.location.country;
    time.innerText = date;
    moodIcon.src = data.current.condition.icon;
    currentMood.innerText = data.current.condition.text;

}

// Function to display next day weather data
function displayNextDayData(data) {
    const nextDay = document.getElementById("nextDay");
    const nextMaxtemp_c = document.getElementById("nextMaxtemp_c");
    const nextIcon = document.getElementById("nextIcon");
    const nextMintemp_c = document.getElementById("nextMintemp_c");

    let dateOfDay = new Date(data.forecast.forecastday[1].date).toLocaleString("en-US", { weekday: "long" });
    let dateOfDate = new Date(data.forecast.forecastday[1].date).toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric" });

    nextDay.innerHTML =
        `
    <p class="fs-3 text-white-50  mb-0"> ${dateOfDay} </p>
    <p class="fs-5 text-white-50  mt-1"> ${dateOfDate} </p>
    `;
    nextMaxtemp_c.innerText = data.forecast.forecastday[1].day.maxtemp_c + "°";
    nextIcon.src = data.forecast.forecastday[1].day.condition.icon;
    nextMintemp_c.innerText = data.forecast.forecastday[1].day.mintemp_c + "°";

}

// Function to display after next day weather data 
function displayAfterDayData(data) {
    const afterDay = document.getElementById("afterDay");
    const afterMaxtemp_c = document.getElementById("afterMaxtemp_c");
    const afterIcon = document.getElementById("afterIcon");
    const afterMintemp_c = document.getElementById("afterMintemp_c");

    let dateOfDay = new Date(data.forecast.forecastday[2].date).toLocaleString("en-US", { weekday: "long" });
    let dateOfDate = new Date(data.forecast.forecastday[2].date).toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric" });

    afterDay.innerHTML =
        `
    <p class="fs-3 text-white-50  mb-0"> ${dateOfDay} </p>
    <p class="fs-5 text-white-50  mt-1"> ${dateOfDate} </p>
    `;
    afterMaxtemp_c.innerText = data.forecast.forecastday[2].day.maxtemp_c + "°";
    afterIcon.src = data.forecast.forecastday[2].day.condition.icon;
    afterMintemp_c.innerText = data.forecast.forecastday[2].day.mintemp_c + "°";

}

// Function to display weather details
function displayWeatherDetails(data) {
    const clouds = document.getElementById("clouds");
    const wind = document.getElementById("wind");
    const humidity = document.getElementById("humidity");

    clouds.innerText = data.current.cloud + "%";
    wind.innerText = data.current.wind_kph + "km/h";
    humidity.innerText = data.current.humidity + "%";
}

// Function to change the background image
function backgroundChanger(data) {
    // get the main element
    const main = document.querySelector("main");
    
    // set the image path
    let imagePath = "./assets/images/";
    
    // condition to check the current weather is day or night
    imagePath += data.current.is_day == 1 ? "day/" : "night/";
    
    // get the current weather code from api
    const code = data.current.condition.code;
    
    
    // condition to check the weather code and set the image path
    
    // this codes are for the clear weather
    if (code === 1000) {
        imagePath += "clear.jpg";
    }

    // this codes are for the cloudy weather 
    else if (
        [1003, 1009, 1030, 1069, 1087, 1135, 1273, 1276, 1279, 1282].includes(code)
    ) {
        imagePath += "cloudy.jpg";
    }

    // this codes are for the rainy weather
    else if (
        [1063, 1069, 1072, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1204, 1207, 1240, 1243, 1246, 1249, 1252].includes(code)
    ) {
        imagePath += "rainy.jpg";
    }
    
    // this codes are for the snowy weather
    else {
        imagePath += "snow.jpg";
    }
    
    // set the background image
    main.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.26),rgba(0, 0, 0, 0.47)) ,url(${imagePath})`;
}



