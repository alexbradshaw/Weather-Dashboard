var currentDate = document.getElementById('currentDate')
var weatherEmoji = document.getElementById('weatherEmoji')
var locationDiv = document.getElementById('location')
var currentLocation = navigator.geolocation.getCurrentPosition(success, error)
var apiKey = "7f797aeb2c4333e090bbfef3ca363921"
var currentTemp = document.getElementById('temp')
var currentHumidity = document.getElementById('humidity')
var currentWindSpeed = document.getElementById('windSpeed')
var currentUV = document.getElementById('uvIndex')
var searchButton = document.getElementById('searchButton')
var searchBar = document.getElementById('searchBar')
var lightSwitch = 'off'
var todayUrl = ''
var fiveDayUrl = ''
var searchHistory = document.getElementById('citiesUL')
var amount = JSON.parse(localStorage.getItem('childrenNumber')) + 1

// populate search history
for (var i = 1; i < amount; i++) {
    newButton = document.createElement('button')
    newButton.classList.add('list-group-item')
    childrenNumber = searchHistory.childElementCount + 1;
    newButton.id = ("search" + childrenNumber)
    newButton.classList.add('searchHistoryButton')
    coolItem = localStorage.getItem('search' + i)
    console.log(coolItem)
    newButton.textContent = coolItem
    searchHistory.appendChild(newButton)
}

// location change function
searchButton.addEventListener('click', function (event) {
    event.preventDefault();
    lightSwitch = 'on'
    city = searchBar.value
    createButton();
    searchBar.value = ''
    success();
});

// display current weather + location + five day forecast
function success(position) {
    if (lightSwitch == 'on') {
        // search bar location
        fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey)
            .then(response => response.json())
            .then(fetchWebsite)
    } else {
        // current location weather
        var lat = position.coords.latitude
        var long = position.coords.longitude
        var todayUrl = ("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=imperial&appid=" + apiKey)
        var fiveDayUrl = ("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&units=imperial&appid=" + apiKey)

        fetch(todayUrl)
            .then(response => response.json())
            // current conditions
            .then(updateForecast);

        // current city
        fetch(fiveDayUrl)
            .then(response => response.json())
            .then(function (data) {
                // console.log(data)
                locationDiv.textContent = data.city.name + ' Weather '
            });

        // five day forecast
        fetch(fiveDayUrl)
            .then(response => response.json())
            .then(updateFiveDayForecast);
    }
}

// failed location services code 
function error() {
    alert('Please enable location services.')
    locationDiv.textContent = 'Location Services are off.'
}

// current date logic
currentDate.textContent = moment().format('l');

// five day forecast time
for (var i = 0; i < 5; i++) {
    day = document.getElementById('days' + i)
    daysAddition = moment().add(i + 1, 'days').calendar('l');
    day.innerHTML = daysAddition
}

// autocomplete
$(function () {
    var availableTags = ["Aberdeen", "Abilene", "Akron", "Albany", "Albuquerque", "Alexandria", "Allentown", "Amarillo", "Anaheim", "Anchorage", "Ann Arbor", "Antioch", "Apple Valley", "Appleton", "Arlington", "Arvada", "Asheville", "Athens", "Atlanta", "Atlantic City", "Augusta", "Aurora", "Austin", "Bakersfield", "Baltimore", "Barnstable", "Baton Rouge", "Beaumont", "Bel Air", "Bellevue", "Berkeley", "Bethlehem", "Billings", "Birmingham", "Bloomington", "Boise", "Boise City", "Bonita Springs", "Boston", "Boulder", "Bradenton", "Bremerton", "Bridgeport", "Brighton", "Brownsville", "Bryan", "Buffalo", "Burbank", "Burlington", "Cambridge", "Canton", "Cape Coral", "Carrollton", "Cary", "Cathedral City", "Cedar Rapids", "Champaign", "Chandler", "Charleston", "Charlotte", "Chattanooga", "Chesapeake", "Chicago", "Chula Vista", "Cincinnati", "Clarke County", "Clarksville", "Clearwater", "Cleveland", "College Station", "Colorado Springs", "Columbia", "Columbus", "Concord", "Coral Springs", "Corona", "Corpus Christi", "Costa Mesa", "Dallas", "Daly City", "Danbury", "Davenport", "Davidson County", "Dayton", "Daytona Beach", "Deltona", "Denton", "Denver", "Des Moines", "Detroit", "Downey", "Duluth", "Durham", "El Monte", "El Paso", "Elizabeth", "Elk Grove", "Elkhart", "Erie", "Escondido", "Eugene", "Evansville", "Fairfield", "Fargo", "Fayetteville", "Fitchburg", "Flint", "Fontana", "Fort Collins", "Fort Lauderdale", "Fort Smith", "Fort Walton Beach", "Fort Wayne", "Fort Worth", "Frederick", "Fremont", "Fresno", "Fullerton", "Gainesville", "Garden Grove", "Garland", "Gastonia", "Gilbert", "Glendale", "Grand Prairie", "Grand Rapids", "Grayslake", "Green Bay", "GreenBay", "Greensboro", "Greenville", "Gulfport-Biloxi", "Hagerstown", "Hampton", "Harlingen", "Harrisburg", "Hartford", "Havre de Grace", "Hayward", "Hemet", "Henderson", "Hesperia", "Hialeah", "Hickory", "High Point", "Hollywood", "Honolulu", "Houma", "Houston", "Howell", "Huntington", "Huntington Beach", "Huntsville", "Independence", "Indianapolis", "Inglewood", "Irvine", "Irving", "Jackson", "Jacksonville", "Jefferson", "Jersey City", "Johnson City", "Joliet", "Kailua", "Kalamazoo", "Kaneohe", "Kansas City", "Kennewick", "Kenosha", "Killeen", "Kissimmee", "Knoxville", "Lacey", "Lafayette", "Lake Charles", "Lakeland", "Lakewood", "Lancaster", "Lansing", "Laredo", "Las Cruces", "Las Vegas", "Layton", "Leominster", "Lewisville", "Lexington", "Lincoln", "Little Rock", "Long Beach", "Lorain", "Los Angeles", "Louisville", "Lowell", "Lubbock", "Macon", "Madison", "Manchester", "Marina", "Marysville", "McAllen", "McHenry", "Medford", "Melbourne", "Memphis", "Merced", "Mesa", "Mesquite", "Miami", "Milwaukee", "Minneapolis", "Miramar", "Mission Viejo", "Mobile", "Modesto", "Monroe", "Monterey", "Montgomery", "Moreno Valley", "Murfreesboro", "Murrieta", "Muskegon", "Myrtle Beach", "Naperville", "Naples", "Nashua", "Nashville", "New Bedford", "New Haven", "New London", "New Orleans", "New York", "New York City", "Newark", "Newburgh", "Newport News", "Norfolk", "Normal", "Norman", "North Charleston", "North Las Vegas", "North Port", "Norwalk", "Norwich", "Oakland", "Ocala", "Oceanside", "Odessa", "Ogden", "Oklahoma City", "Olathe", "Olympia", "Omaha", "Ontario", "Orange", "Orem", "Orlando", "Overland Park", "Oxnard", "Palm Bay", "Palm Springs", "Palmdale", "Panama City", "Pasadena", "Paterson", "Pembroke Pines", "Pensacola", "Peoria", "Philadelphia", "Phoenix", "Pittsburgh", "Plano", "Pomona", "Pompano Beach", "Port Arthur", "Port Orange", "Port Saint Lucie", "Port St. Lucie", "Portland", "Portsmouth", "Poughkeepsie", "Providence", "Provo", "Pueblo", "Punta Gorda", "Racine", "Raleigh", "Rancho Cucamonga", "Reading", "Redding", "Reno", "Richland", "Richmond", "Richmond County", "Riverside", "Roanoke", "Rochester", "Rockford", "Roseville", "Round Lake Beach", "Sacramento", "Saginaw", "Saint Louis", "Saint Paul", "Saint Petersburg", "Salem", "Salinas", "Salt Lake City", "San Antonio", "San Bernardino", "San Buenaventura", "San Diego", "San Francisco", "San Jose", "Santa Ana", "Santa Barbara", "Santa Clara", "Santa Clarita", "Santa Cruz", "Santa Maria", "Santa Rosa", "Sarasota", "Savannah", "Scottsdale", "Scranton", "Seaside", "Seattle", "Sebastian", "Shreveport", "Simi Valley", "Sioux City", "Sioux Falls", "South Bend", "South Lyon", "Spartanburg", "Spokane", "Springdale", "Springfield", "St. Louis", "St. Paul", "St. Petersburg", "Stamford", "Sterling Heights", "Stockton", "Sunnyvale", "Syracuse", "Tacoma", "Tallahassee", "Tampa", "Temecula", "Tempe", "Thornton", "Thousand Oaks", "Toledo", "Topeka", "Torrance", "Trenton", "Tucson", "Tulsa", "Tuscaloosa", "Tyler", "Utica", "Vallejo", "Vancouver", "Vero Beach", "Victorville", "Virginia Beach", "Visalia", "Waco", "Warren", "Washington", "Waterbury", "Waterloo", "West Covina", "West Valley City", "Westminster", "Wichita", "Wilmington", "Winston", "Winter Haven", "Worcester", "Yakima", "Yonkers", "York", "Youngstown"];
    $("#searchBar").autocomplete({
        source: availableTags
    });
});

// adding buttons to search history
function createButton() {
    newButton = document.createElement('button')
    newButton.classList.add('list-group-item')
    childrenNumber = searchHistory.childElementCount + 1;
    newButton.id = ("search" + childrenNumber)
    newButton.classList.add('searchHistoryButton')
    initialButtonContent = searchBar.value
    buttonContent = initialButtonContent.charAt(0).toUpperCase() + initialButtonContent.slice(1)
    newButton.textContent = buttonContent
    localStorage.setItem(newButton.id, buttonContent)
    localStorage.setItem('childrenNumber', childrenNumber)
    searchHistory.appendChild(newButton)
}

// made search history buttons clickable
searchHistory.addEventListener('click', function (event) {
    elementCheck = JSON.stringify(event.target.id)
    city = document.getElementById(event.target.id).innerHTML
    if (elementCheck.includes('search')) {
        fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey)
            .then(response => response.json())
            .then(fetchWebsite)
    }
})

// fetches current info and five day forecast
function fetchWebsite(data) {
    data
    console.log(data)
    console.log(data.city.coord.lat, data.city.coord.lon)
    var lat = data.city.coord.lat
    var long = data.city.coord.lon
    var todayUrl = ("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=imperial&appid=" + apiKey)
    var fiveDayUrl = ("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&units=imperial&appid=" + apiKey)
    fetch(todayUrl)
    .then(response => response.json())
    // current conditions
    .then(updateForecast,console.log(data)),

    // current city
    fetch(fiveDayUrl)
        .then(response => response.json())
        .then(function (data) {
            locationDiv.textContent = data.city.name + ' Weather '
        }),

    // five day forecast
    fetch(fiveDayUrl)
        .then(response => response.json())
        .then(updateFiveDayForecast)
};

// updates current weather element with info and icon
function updateForecast(data) {
    data
    // console.log(data)
    currentTemp.textContent = data.current.temp
    currentHumidity.textContent = data.current.humidity
    currentWindSpeed.textContent = data.current.wind_speed
    currentUV.textContent = data.current.uvi
    currentUVI = JSON.parse(data.current.uvi)
    if (currentUVI > 3 && currentUVI < 6) {
        currentUV.classList.add('uvWarning')
        currentUV.classList.remove('uvOuch')
        currentUV.classList.remove('uvRealBad')
    } else if (currentUVI > 6 && currentUVI < 9) {
        currentUV.classList.add('uvOuch')
        currentUV.classList.remove('uvRealBad')
    } else if (currentUVI > 9 && currentUVI < 12) {
        currentUV.classList.add('uvRealBad')
    } else {
        currentUV.classList.remove('uvWarning')
        currentUV.classList.remove('uvOuch')
        currentUV.classList.remove('uvRealBad')
    }
    currentCondition = data.current.weather[0].id
    if (currentCondition == 800) {
        weatherEmoji.innerHTML = '☀️'
    } else if (currentCondition == 801 || currentCondition == 802) {
        weatherEmoji.innerHTML = '⛅'
    } else if (currentCondition == 803 || currentCondition == 804) {
        weatherEmoji.innerHTML = '☁️'
    } else if (currentCondition >= 600 && currentCondition < 700) {
        weatherEmoji.innerHTML = '❄️'
    } else if (currentCondition >= 500 && currentCondition < 600) {
        weatherEmoji.innerHTML = '🌧️'
    } else if (currentCondition >= 300 && currentCondition < 400) {
        weatherEmoji.innerHTML = '☂️'
    } else if (currentCondition >= 200 && currentCondition < 300) {
        weatherEmoji.innerHTML = '🌩️'
    } else {
        weatheweatherEmoji.innerHTML = '🌪️'
    }
};

// updates five day forecast element with info and icon
function updateFiveDayForecast(data) {
    data

    humidityArray = [
        data.list[6].main.humidity,
        data.list[14].main.humidity,
        data.list[22].main.humidity,
        data.list[30].main.humidity,
        data.list[38].main.humidity]

    tempArray = [
        data.list[6].main.temp,
        data.list[14].main.temp,
        data.list[22].main.temp,
        data.list[30].main.temp,
        data.list[38].main.temp]

    currentCondition = [
        data.list[6].weather[0].id,
        data.list[14].weather[0].id,
        data.list[22].weather[0].id,
        data.list[30].weather[0].id,
        data.list[38].weather[0].id
    ]

    // forecast info updater
    for (var i = 0; i < 5; i++) {
        day = document.getElementById('day' + i + 'Info')
        daysInfo = ("Temperature: " + tempArray[i] + " ℉<br>" + "Humidity: " + humidityArray[i] + '%')
        day.innerHTML = daysInfo
        weatherIcon = document.getElementById('weatherIcon' + i)
        if (currentCondition[i] == 800) {
            weatherIcon.innerHTML = '☀️'
        } else if (currentCondition[i] == 801 || currentCondition[i] == 802) {
            weatherIcon.innerHTML = '⛅'
        } else if (currentCondition[i] == 803 || currentCondition[i] == 804) {
            weatherIcon.innerHTML = '☁️'
        } else if (currentCondition[i] >= 600 && currentCondition[i] < 700) {
            weatherIcon.innerHTML = '❄️'
        } else if (currentCondition[i] >= 500 && currentCondition[i] < 600) {
            weatherIcon.innerHTML = '🌧️'
        } else if (currentCondition[i] >= 300 && currentCondition[i] < 400) {
            weatherIcon.innerHTML = '☂️'
        } else if (currentCondition[i] >= 200 && currentCondition[i] < 300) {
            weatherIcon.innerHTML = '🌩️'
        } else {
            weatherIcon.innerHTML = '🌪️'
        }
    }
}
