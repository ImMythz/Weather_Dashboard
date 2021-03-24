const currentDate = new Date().toLocaleDateString('en-US')
const cityFormEl = document.querySelector('#cityForm')
const cityNameEl = document.querySelector('#cityName')
const cityListEl = document.querySelector('#cityList')
const weeklyEl = document.querySelector('#weeklyWeather')
const dailyCardEl = document.querySelector('.daily')
const searchBtnEl = document.querySelector('#searchBtn')
const currentWeatherEl = document.querySelector('#currentWeather')

//Submit user input functions
cityFormEl.addEventListener('submit', function(event){
    event.preventDefault();
    const cityNameVal = cityNameEl.value
    console.log(cityNameEl.value)
  
    if (cityNameVal === '') {
        const messageEl = cityFormEl.children[1]
        messageEl.classList.remove('d-none')
        messageEl.classList.add('d-block')
    } else {
        currentWeatherEl.innerHTML = '';
        weeklyEl.innerHTML = '';
        printCityList(cityNameVal);
        getWeather(cityNameVal);
    }
});


//Makes a list of past searches below input box
const printCityList = function(name) {
    const cityListItem = document.createElement('li')
    cityListItem.classList.add('list-unstyled', 'list-group-item', 'list-group-item-action', 'h6', 'mt-1')
    cityListItem.textContent = name;
    cityListEl.appendChild(cityListItem)

    cityListItem.onclick = function(){
        currentWeatherEl.innerHTML = '';
        weeklyEl.innerHTML = '';
        getWeather(event.target.textContent)
      }
};

//All API functions for retrieving data
const getWeather = function (cityName) {
    const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial&appid=f05e59dca587993db2e06e2c3a372a11'
    fetch(weatherUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            const iconCode = data.weather[0].icon
            const iconUrl = 'https://www.openweathermap.org/img/wn/' + iconCode + '.png'

            const currentWeatherDiv = document.createElement('div')
            currentWeatherEl.appendChild(currentWeatherDiv)
            currentWeatherDiv.innerHTML = '<h2>' + data.name + ' ' + currentDate + ' ' + '<img src="' + iconUrl + '" alt="Weather Icons">' + '</h2>' + '<h6>' + '<p>' + "Temp: " + Math.round(data.main.temp) + " ℉" + '</p>' + '<p>' + "Humid: " + data.main.humidity + "%" + '</p>' + '<p>' + "Wind Speed: " + data.wind.speed + " MPH" + '</p>' + '</h6>'

            const uvUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + data.coord.lat + '&lon=' + data.coord.lon + '&exclude=current,minutely,hourly,alerts&units=imperial&appid=f05e59dca587993db2e06e2c3a372a11'

            fetch(uvUrl)
                .then(function(response){
                    return response.json();
                })
                //Creates an element for the UV info and changes the color based on the argument
                .then(function (data){
                    console.log(data)
                    const uv1El = document.createElement('div')
                    currentWeatherDiv.appendChild(uv1El)
                    uv1El.innerHTML = '<h6>' + "UV Index: " + data.daily[0].uvi + '</h6>'
                    
                    if(data.daily[0].uvi === 0 || data.daily[0].uvi < 3){
                        uv1El.setAttribute("style", "color: green;")
                    } else if (data.daily[0].uvi >= 3 && data.daily[0].uvi <= 6) {
                        uv1El.setAttribute("style", "color: orange;")
                    } else {
                        uv1El.setAttribute("style", "color: red;")
                    }

                    //Places info in 5-Day Forecast tiles
                    const weeklyLabelEl = document.querySelector('#weeklyLabel')
                    weeklyLabelEl.innerHTML = '<h3>' + '5-Day Forecast:' + '</h3>'

                    for(var i = 1; i < 6; i++){
                        const dailyDate = new Date(data.daily[i].dt * 1000).toLocaleDateString('en-US')
                        const dailyWeatherIcon = data.daily[i].weather[0].icon
                        const iconUrl = 'https://www.openweathermap.org/img/wn/' + dailyWeatherIcon + '.png'
                        const weeklyDiv = document.createElement('div')
                        weeklyDiv.classList.add('weekly', 'rounded', 'card', 'p-3', 'mr-3', 'bg-gradient')
                        weeklyEl.appendChild(weeklyDiv)
                        weeklyDiv.innerHTML = '<h6>' + '<p>' + dailyDate + '</p>' + '<p>' +  '<img src="' + iconUrl + '" alt="Weather Icons">' + '</p>' + '<p>' + "Temp: " + Math.round(data.daily[i].temp.max) + " ℉" + '</p>' + '<p>' + "Humid: " + data.daily[i].humidity + "%" + '</p>' + '</h6>'
                    }
                })
        })
};
