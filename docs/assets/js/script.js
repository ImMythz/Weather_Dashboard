// Declared variables
const currentDate = new Date().toLocaleDateString('en-US')
const sideNavEl = document.querySelector('#sideNav')
const cityInputEl = document.querySelector('#cityInput')
const cityListEl = document.querySelector('#cityList')
const fiveDayForecastEl = document.querySelector('#fiveDayForecast')
const searchedCityEl = document.querySelector('#searchedCity')
const dailyWeatherEl = document.querySelector('#dailyWeather')
const forecastWeatherEl = document.querySelector('#forecastHeader')

// Captures User inputed info
sideNavEl.addEventListener('submit', function (event) {
    event.preventDefault();
    let cityInputVal = cityInputEl.value
    console.log(cityInputEl.value)

    if (cityInputVal === '') {
        let messageEl = sideNavEl.children[1]
        messageEl.classList.remove('d-none')
        messageEl.classList.add('d-block')
    } else {
        dailyWeatherEl.innerHTML = '';
        fiveDayForecastEl.innerHTML = '';
        pastSearchList(cityInputVal);
        fetchWeather(cityInputVal);
    }
});

// Creates a list of past searches below input field
const pastSearchList = function (name) {
    let recentSearch = document.createElement('li')
    recentSearch.classList.add('list-unstyled', 'list-group-item', 'list-group-item-action', 'h6')
    recentSearch.textContent = name;
    cityListEl.appendChild(recentSearch)

    recentSearch.onclick = function () {
        dailyWeatherEl.innerHTML = '';
        fiveDayForecastEl.innerHTML = '';
        fetchWeather(event.target.textContent)
    }
};

// Fetch request for current weather data
const fetchWeather = function (cityInput) {
    const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityInput + '&units=imperial&appid=19fb7afc722496f115e7df602c287f5c'
    fetch(weatherUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            let iconCode = data.weather[0].icon
            let iconUrl = 'https://www.openweathermap.org/img/wn/' + iconCode + '.png'

            let dailyWeatherDiv = document.createElement('div')
            dailyWeatherEl.appendChild(dailyWeatherDiv)
            dailyWeatherDiv.innerHTML = '<h2>' + data.name + ' ' + currentDate + ' ' + '<img src="' + iconUrl + '" alt="Weather Icons">' + '</h2>' + '<h6>' + '<p>' + "Temp: " + Math.round(data.main.temp) + " ℉" + '</p>' + '<p>' + "Humid: " + data.main.humidity + "%" + '</p>' + '<p>' + "Wind Speed: " + data.wind.speed + " MPH" + '</p>' + '</h6>'

            let uvUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + data.coord.lat + '&lon=' + data.coord.lon + '&exclude=current,minutely,hourly,alerts&units=imperial&appid=19fb7afc722496f115e7df602c287f5c'

            // Fetch Request for UV Data
            fetch(uvUrl)
                .then(function (response) {
                    return response.json();
                })

                // Creates an element for the UV info to be displayed in
                .then(function (data) {
                    console.log(data)
                    let cityUV = data.daily[0].uvi
                    let currentUv = document.createElement('p')
                    dailyWeatherDiv.appendChild(currentUv)
                    currentUv.innerHTML = 'UV Index: ' + '<span class="badge badge-danger">' + cityUV + '</span>'
                    dailyWeatherDiv.append(currentUv)

                    // Creates 5 tiles for future weather forecast
                    const fiveDayForecastEl = document.querySelector('#fiveDayForecast')
                    forecastWeatherEl.innerHTML = '<h2>' + "5-Day Forecast" + '</h2>'

                    for (var i = 1; i < 6; i++) {
                        let searchDate = new Date(data.daily[i].dt * 1000).toLocaleDateString('en-US')
                        let weatherIcon = data.daily[i].weather[0].icon
                        let iconUrl = 'https://www.openweathermap.org/img/wn/' + weatherIcon + '.png'
                        let forecastDiv = document.createElement('div')
                        forecastDiv.classList.add('weekly', 'rounded', 'card', 'p-3', 'ml-3', 'mr-3', 'bg-gradient', 'blueCard')
                        fiveDayForecastEl.appendChild(forecastDiv)
                        forecastDiv.innerHTML = '<h6>' + '<p>' + searchDate + '</p>' + '<p>' + '<img src="' + iconUrl + '" alt="Weather Icons">' + '</p>' + '<p>' + "Temp: " + data.daily[i].temp.max + " ℉" + '</p>' + '<p>' + "Humid: " + data.daily[i].humidity + "%" + '</p>' + '</h6>'
                    }
                })
        })
}