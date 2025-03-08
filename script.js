const apiKey = '0384144646ea232d0f226057b6f847a1'; // My OpenWeatherMap API Key
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const unitToggle = document.getElementById('unitToggle');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const weatherIcon = document.getElementById('weatherIcon');
const forecastContainer = document.getElementById('forecastContainer');

let isCelsius = true;

// Fetch weather data
async function getWeather(city) {
    const unit = isCelsius ? 'metric' : 'imperial';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`;

    try {
        const [weatherResponse, forecastResponse] = await Promise.all([fetch(url), fetch(forecastUrl)]);
        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();

        if (weatherData.cod === '404') {
            alert('City not found');
        } else {
            displayWeather(weatherData);
            displayForecast(forecastData);
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. Please try again.');
    }
}

// Display weather data
function displayWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `Temperature: ${data.main.temp} ${isCelsius ? '°C' : '°F'}`;
    description.textContent = `Weather: ${data.weather[0].description}`;
    feelsLike.textContent = `Feels Like: ${data.main.feels_like} ${isCelsius ? '°C' : '°F'}`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeed.textContent = `Wind Speed: ${data.wind.speed} ${isCelsius ? 'm/s' : 'mph'}`;
    sunrise.textContent = `Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}`;
    sunset.textContent = `Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}`;
    weatherIcon.innerHTML = `<i class="fas ${getWeatherIcon(data.weather[0].main)}"></i>`;
}

// Display 5-day forecast
function displayForecast(data) {
    forecastContainer.innerHTML = '';
    const forecastData = data.list.filter((item, index) => index % 8 === 0).slice(0, 5);

    forecastData.forEach(item => {
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <p>${new Date(item.dt * 1000).toLocaleDateString()}</p>
            <p><i class="fas ${getWeatherIcon(item.weather[0].main)}"></i></p>
            <p>${item.main.temp} ${isCelsius ? '°C' : '°F'}</p>
            <p>${item.weather[0].description}</p>
        `;
        forecastContainer.appendChild(forecastItem);
    });
}

// Get weather icon based on weather condition
function getWeatherIcon(weatherCondition) {
    switch (weatherCondition.toLowerCase()) {
        case 'clear':
            return 'fa-sun';
        case 'rain':
            return 'fa-cloud-rain';
        case 'clouds':
            return 'fa-cloud';
        case 'snow':
            return 'fa-snowflake';
        default:
            return 'fa-cloud';
    }
}

// Toggle between Celsius and Fahrenheit
unitToggle.addEventListener('click', () => {
    isCelsius = !isCelsius;
    unitToggle.textContent = isCelsius ? 'Switch to °F' : 'Switch to °C';
    const city = cityName.textContent.split(',')[0];
    if (city) getWeather(city);
});

function updateTime() {
    const now = new Date();
    const date = now.toLocaleDateString(); // Get the date
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    document.getElementById('currentTime').textContent = `Current Time: ${date} ${timeString}`;
}

// Search for a city
searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        getWeather(city);
    } else {
        alert('Please enter a city name');
    }
});

// Default city on load
getWeather('Pretoria');