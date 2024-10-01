function getWeather(){
    const apiKey = `d8fac75dfbfbb937910d5f414d15a340`
    const city = document.getElementById('city').value

    if (!city) {
        alert('Please enter a city')
        return
    }

    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    const forecastURL =  `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`

    Promise.all([fetch(currentWeatherURL), fetch(forecastURL)])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(([currentWeatherData, forecastData]) => {
            displayWeather(currentWeatherData)
            displayHourlyForecast(forecastData.list)
        })
        .catch(error => {
            console.error('Error fetching weather data:', error)
            alert('Error fetching weather data. Please try again.')
        })
} 

function displayWeather(data){
    const tempDivInfo = document.getElementById('temp-div')
    const weatherInfoDiv = document.getElementById('weather-info')
    const weatherIcon = document.getElementById('weather-icon')
    const hourlyForecastDiv = document.getElementById('hourly-forecast')

    //clear content
    weatherInfoDiv.innerHTML = ""
    hourlyForecastDiv.innerHTML = ""
    tempDivInfo.innerHTML = ""

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`
    } else {
        const cityName = data.name
        const temperature = Math.round(data.main.temp - 273.15)
        const description = data.weather[0].description
        const iconCode = data.weather[0].icon
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`

        const temperatureHTML = `
        <p>${temperature}°C</p>`

        const weatherHTML = `
        <p>${cityName}</p>
        <p>${description}</p>`

        tempDivInfo.innerHTML = temperatureHTML
        weatherInfoDiv.innerHTML = weatherHTML
        weatherIcon.src = iconUrl
        weatherIcon.alt = description

        showImage()
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast')

    if (!hourlyData || !Array.isArray(hourlyData)) {
        console.error('Invalid hourly forecast data')
        hourlyForecastDiv.innerHTML = `<p>No hourly forecast available.</p>`
        return
    }

    const next24Hours = hourlyData.slice(0, 8)

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000)
        const hour = dateTime.getHours()
        const temperature = Math.round(item.main.temp - 273.15)
        const iconCode = item.weather[0].icon
        const iconURL = `https://openweathermap.org/img/wn/${iconCode}.png`

        const hourlyItemHtml = `
        <div class="hourly-item">
            <span>${hour}:00</span>
            <img src="${iconURL}" alt="Hourly Weather Icon">
            <span>${temperature}°C</span>
        </div>`

        hourlyForecastDiv.innerHTML += hourlyItemHtml

    })
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon')
    weatherIcon.style.display = 'block'
}