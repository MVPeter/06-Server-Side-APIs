
//Weather arrays
var currentWeather = [];
var fiveDayWeather = [];
//Buttons arrays
var savedBArray = [];
var arraybuttons = "";
var saveCityArray = [];
var lsClean = [];
//City searched
var savedCity = "";
//URLs for api
var forcastURL = "";
var UVqueryURL = "";
var UVIndex = 0;
//Latitude Longitude
var lat = 0;
var lon = 0;


//current Date on page load
$(document).ready(function () {
    $("#weatherpage").addClass("hide")
//detect Localstorage and collect items if needed.
    if (localStorage.length > 0) {
        for (let i = 0; i < localStorage.length; i++) {
            lsClean.unshift(localStorage.key(i));
            arraybuttons = JSON.parse(localStorage.getItem(lsClean[i]));
            forcastURL = arraybuttons[0];
            UVqueryURL = arraybuttons[1];
        }
    }

    for (let i = 0; i < lsClean.length; i++) {
        createButtons(lsClean[i]);
    }

});

function buildQueryURLUV(lat, lon) {
    // Set the API key
    var queryParams = "61921206a3d3feadf5aea21d13561e1e&units=imperial";

    // Grab text the user typed into the search input, add to the queryParams object
    var u = "lat=" + lat + "&lon=" + lon;

    // queryURL query the API
    UVqueryURL = "https://api.openweathermap.org/data/2.5/onecall?" + u + "&appid=" + queryParams;

    // UVURLquery()
    return UVqueryURL
};

function buildQueryURLCurrent() {

    // Set the API key
    var queryParams = "61921206a3d3feadf5aea21d13561e1e&units=imperial";
    // Grab text the user typed into the search input, add to the queryParams object
    var c = $("#citySearched").val()
    // queryURL query the API
    forcastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + c + "&appid=" + queryParams;

    // Logging the URL so we have access to it for troubleshooting
    // console.log("---------------\nCURL: " + forcastURL + "\n---------------");

    return forcastURL;
};

//writes saved City, and search URLS to Local storage.
function localStorageButtons(city) {

    savedCity = city.toLowerCase().replace(/\b[a-z]/g, function (letter) {
        return letter.toUpperCase();
    });
    var saveLocalStorage = JSON.stringify([forcastURL, UVqueryURL]);
    saveCityArray.push({
        "city": savedCity,
        "fURL": forcastURL,
        "UV": UVqueryURL
    });

    localStorage.setItem(savedCity, saveLocalStorage);

    if (localStorage.length > 7) {

        localStorage.clear()
        for (let i = 0; i < saveCityArray.length; i++) {
            var URLStorage = JSON.stringify([saveCityArray[i].fURL, saveCityArray[i].UV]);
            localStorage.setItem(saveCityArray[i].city, URLStorage);

        }
        
    }
}

//on click event for the Search button
$("#searchButton").on("click", function (event) {
    event.preventDefault();
    $("#weatherpage").removeClass("hide");
    //collect City name from Input
    city = $("#citySearched").val();

    //build URL's for the City chosen
    forcastURL = buildQueryURLCurrent();

    //Run CrrentURLquery function
    currentURLquery()

    //Make sure the city searched is formatted with a capicatl letter
    savedCity = city.toLowerCase().replace(/\b[a-z]/g, function (letter) {
        return letter.toUpperCase();
    });


    savedBArray.unshift(savedCity);
    //create a saved button of the current search
    createButtons(savedCity)


});

//on click even tfor any saved city searched button.
$("#newCityButtons").on("click", ".cityButton", function (id) {
    $("#weatherpage").removeClass("hide");
    var savedButtonCity = id.target.id;
    $("#citySearched").val(savedButtonCity);
    returnSaveSearchButtons(savedButtonCity);
});

// Make the AJAX request to the API - GETs the JSON data at the queryURL.
// The data then gets pushed to an array.
function currentURLquery() {
    $.ajax({
        url: forcastURL,
        method: "GET"
    }).then(function (cresponse) {
        // console.log(cresponse);

        city = $("#citySearched").val();
        savedCity = city.toLowerCase().replace(/\b[a-z]/g, function (letter) {
            return letter.toUpperCase();
        });
        localStorageButtons(savedCity);
        UVqueryURL = buildQueryURLUV(cresponse.city.coord.lat, cresponse.city.coord.lon)
        // console.log("---------------\nuvURL: " + UVqueryURL + "\n---------------");
        //clear information array
        currentWeather.splice(0, currentWeather.length);

        // push API info into currentWeather array
        // save Lat and lon number for the to get UV informaiton
        currentWeather.push({ "latitued": cresponse.city.coord.lat });
        currentWeather.push({ "Longitude": cresponse.city.coord.lon });
        //push API info into currentWeather array
        currentWeather.push(savedCity);
        //format date
        pulledTime = cresponse.list[0].dt
        var d = new Date(pulledTime * 1000);
        var dt = d.toLocaleDateString();
        // push weather detals into temp array.
        currentWeather.push(
            {
                "dt": dt,
                "weather": cresponse.list[0].main.temp,
                "icon": cresponse.list[0].weather[0].icon,
                "humidity": cresponse.list[0].main.humidity,
                "windSpeed": cresponse.list[0].wind.speed,

            });
        currentWeather.push(
            {
                "currentURL": forcastURL,
                "UVQueryURL": UVqueryURL,

            })

        //gather 5 days of weather form API omtp array.
        fiveDayWeather.splice(0, fiveDayWeather.length);
        for (let i = 7; i < cresponse.list.length; i += 8) {

            //format date
            pulled5Time = cresponse.list[i].dt
            var d = new Date(pulled5Time * 1000);
            var dt = d.toLocaleDateString();

            var icon = cresponse.list[i].weather[0].icon;
            var temp = cresponse.list[i].main.temp;
            var humidity = cresponse.list[i].main.humidity;

            //push 5  day weather information into array.
            fiveDayWeather.push(
                {
                    "dt": dt,
                    "icon": icon,
                    "temp": temp,
                    "humidity": humidity,
                });
        }
        UVURLquery()

    })
};

function UVURLquery() {
    $.ajax({
        url: UVqueryURL,
        method: "GET"
    }).then(function (uvresponse) {
        // console.log(uvresponse);
        UVIndex = uvresponse.current.uvi;
        currentWeather.push({ "UVIndex": UVIndex, })

        //change background colors for Moderate, High, and extreme UV index.
        if (UVIndex <= 2) {
            $("#currentUVIndex").attr("class", "ModLow")
        } else if (UVIndex <= 7) {
            $("#currentUVIndex").attr("class", "HighVH")
        } else {
            $("#currentUVIndex").attr("class", "extreme")
        }
        updatebody(savedCity)
    });
}

//fucntion to update the main body
function updatebody(city) {
    var currdate = new Date();
    var currdate = (currdate.getMonth() + 1) + '/' + currdate.getDate() + '/' + currdate.getFullYear();
    $("#currentCity").html(city + "  :   " + currentWeather[3].dt);
    updateWatherIcon("#Icon5", currentWeather[3].icon)
    $("#currentTemp").html(currentWeather[3].weather);
    $("#currentHumidity").html(currentWeather[3].humidity);
    $("#currentWindSpeed").html(currentWeather[3].windSpeed);
    $("#currentUVIndex").html(currentWeather[5].UVIndex);
    //update 5 day cards.
    for (let i = 0; i < fiveDayWeather.length; i++) {
        var cardNum = "#Icon" + i;
        var iconCode = fiveDayWeather[i].icon;
        updateWatherIcon(cardNum, iconCode);
    }
    for (let i = 0; i < fiveDayWeather.length; i++) {
        var cardNum = "#DateP" + i;
        var cdate = fiveDayWeather[i].dt;
        updateCarddate(cardNum, cdate);
    }
    for (let i = 0; i < fiveDayWeather.length; i++) {
        var cardNum = "#temp" + i;
        var ctemp = "Temp: " + fiveDayWeather[i].temp;
        updateCarddate(cardNum, ctemp);
    }
    for (let i = 0; i < fiveDayWeather.length; i++) {
        var cardNum = "#humidity" + i;
        var chumidity = "Humidity: " + fiveDayWeather[i].humidity;
        updateCarddate(cardNum, chumidity);
    }
}

//Functions to update the weather Icon based on the code given
function updateWatherIcon(iconNum, iconCode) {
    var iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
    $(iconNum).attr("src", iconURL)
}

function updateCarddate(item, cdate,) {
    $(item).html(cdate);
}

function updateCarddate(item, ctemp,) {
    $(item).text(ctemp);
}

function updateCarddate(item, chumidity,) {
    $(item).html(chumidity);
}

//used to create the HTML buttons for saved searches
function createButtons(city) {
    var storedButtons = $("<button>");
    storedButtons.addClass("cityButton btn btn-light btn-lg btn-block");
    storedButtons.attr("ID", city);
    storedButtons.text(city)
    $("#newCityButtons").prepend(storedButtons);
}

//function to build the saved seaches to buttons from localstorage
function returnSaveSearchButtons(city) {
    savedCity = city.toLowerCase().replace(/\b[a-z]/g, function (letter) {
        return letter.toUpperCase();
    });

    arraybuttons = JSON.parse(localStorage.getItem(savedCity));
    forcastURL = arraybuttons[0];
    UVqueryURL = arraybuttons[1];
    currentURLquery()
}