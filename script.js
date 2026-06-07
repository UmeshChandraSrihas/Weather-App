const apiKey = "1eeb52d71f539968c05517b5b17967ea";

// DATE & TIME

function updateDateTime() {
    const now = new Date();

    document.getElementById("datetime").innerText =
        now.toLocaleString();
}

setInterval(updateDateTime, 1000);

// WEATHER THEMES

function changeTheme(weather) {

    weather = weather.toLowerCase();

    if (weather.includes("clear")) {

        document.body.style.background =
            "linear-gradient(135deg,#ffb347,#ffcc33,#ff9800)";

    } else if (weather.includes("cloud")) {

        document.body.style.background =
            "linear-gradient(135deg,#64748b,#94a3b8,#cbd5e1)";

    } else if (
        weather.includes("rain") ||
        weather.includes("drizzle") ||
        weather.includes("thunderstorm")
    ) {

        document.body.style.background =
            "linear-gradient(135deg,#0f172a,#1e3a8a,#2563eb)";

    } else if (weather.includes("snow")) {

        document.body.style.background =
            "linear-gradient(135deg,#dbeafe,#bfdbfe,#93c5fd)";

    } else if (
        weather.includes("mist") ||
        weather.includes("fog") ||
        weather.includes("haze")
    ) {

        document.body.style.background =
            "linear-gradient(135deg,#475569,#64748b,#94a3b8)";

    } else {

        document.body.style.background =
            "linear-gradient(135deg,#0a0f1f,#111827,#1e293b)";
    }
}

// DISPLAY WEATHER

function displayWeather(data) {

    document.getElementById("city").innerText =
        `${data.name}, ${data.sys.country}`;

    document.getElementById("temp").innerText =
        `${Math.round(data.main.temp)}°C`;

    document.getElementById("condition").innerText =
        data.weather[0].description;

    document.getElementById("humidity").innerText =
        `${data.main.humidity}%`;

    document.getElementById("wind").innerText =
        `${(data.wind.speed * 3.6).toFixed(1)} km/h`;

    document.getElementById("feels").innerText =
        `${Math.round(data.main.feels_like)}°C`;

    document.getElementById("coordinates").innerText =
        `${data.coord.lat.toFixed(4)}, ${data.coord.lon.toFixed(4)}`;

    document.getElementById("location").innerText =
        `📍 ${data.coord.lat.toFixed(4)}, ${data.coord.lon.toFixed(4)}`;

    document.getElementById("sunrise").innerText =
        new Date(data.sys.sunrise * 1000)
        .toLocaleTimeString();

    document.getElementById("sunset").innerText =
        new Date(data.sys.sunset * 1000)
        .toLocaleTimeString();

    document.getElementById("pressure").innerText =
        `${data.main.pressure} hPa`;

    document.getElementById("visibility").innerText =
        `${(data.visibility / 1000).toFixed(1)} km`;

    document.getElementById("icon").src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

    changeTheme(data.weather[0].main);
}

// 5 DAY FORECAST

async function getForecast(city) {

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );

        const data = await response.json();

        if (!response.ok) {
            console.error(data);
            return;
        }

        const forecastContainer =
            document.getElementById("forecast");

        forecastContainer.innerHTML = "";

        const forecastDays =
            data.list.filter(item =>
                item.dt_txt.includes("12:00:00")
            );

        forecastDays.slice(0, 5).forEach(day => {

            const date =
                new Date(day.dt_txt);

            forecastContainer.innerHTML += `

            <div class="forecast-card">

                <h4>
                    ${date.toLocaleDateString(
                        "en-US",
                        { weekday: "short" }
                    )}
                </h4>

                <img
                    src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
                    alt="forecast">

                <p>
                    ${Math.round(day.main.temp)}°C
                </p>

                <small>
                    ${day.weather[0].main}
                </small>

            </div>

            `;
        });

    } catch (error) {

        console.error(error);

    }
}

// SEARCH WEATHER

async function getWeather() {

    const city =
        document.getElementById("cityInput")
        .value.trim();

    if (!city) {

        alert("Please enter a city name.");
        return;
    }

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);
            return;
        }

        displayWeather(data);

        getForecast(city);

    } catch (error) {

        console.error(error);

        alert(
            "Failed to fetch weather data."
        );
    }
}

// LIVE LOCATION

function getLocationWeather() {

    if (!navigator.geolocation) {

        alert(
            "Geolocation is not supported by your browser."
        );

        return;
    }

    navigator.geolocation.getCurrentPosition(

        async (position) => {

            try {

                const lat =
                    position.coords.latitude;

                const lon =
                    position.coords.longitude;

                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
                );

                const data = await response.json();

                if (!response.ok) {

                    alert(data.message);
                    return;
                }

                displayWeather(data);

                getForecast(data.name);

            } catch (error) {

                console.error(error);

                alert(
                    "Unable to fetch location weather."
                );
            }

        },

        () => {

            alert(
                "Please allow location access."
            );

        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }

    );
}

// ENTER KEY SEARCH

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateDateTime();

        getLocationWeather();

        document
            .getElementById("cityInput")
            .addEventListener(
                "keypress",
                function (e) {

                    if (e.key === "Enter") {
                        getWeather();
                    }

                }
            );

    }
);