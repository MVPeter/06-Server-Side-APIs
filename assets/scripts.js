
var currentWeather = [];
// var futureWeather = [];
var fiveDayWeather = [];
var test5 = [];
var savedBArray = [];
var arraybuttons = "";
// Build the query URL for the ajax request to the NYT API
var savedCity = "";
var forcastURL = "";
// var FqueryURL = buildQueryURLFuture();
var UVqueryURL = "";
var UVIndex = 0;
var lat = 0;
var lon = 0;
var lsClean = [];



//current Date on page load
$(document).ready(function () {
    $("#weatherpage").addClass("hide")

    for (let i = 0; i < localStorage.length; i++) {
        lsClean.unshift(localStorage.key(i));
    }
    if (localStorage.length > 8) {
        for (let i = 0; i < lsClean.length; i++) {
            localStorageButtons(lsClean[i])
        }

        localStorage.clear()
        location.reload();
    } else {
        for (let i = 0; i < lsClean.length; i++) {
            createButtons(lsClean[i]);
        }
    }
});


//Funciton to update webpage cards to the first item in the array
function updateHistoryArray(id, cityObject, newValue) {
    for (let id = 0; id < buttons.length; id++) {
        var array = buttons[id].id.city;
        array.cityObject = newValue;
        return;
    };


};


function buildQueryURLUV(lat, lon) {
    // Set the API key
    var queryParams = "61921206a3d3feadf5aea21d13561e1e&units=imperial";

    // Grab text the user typed into the search input, add to the queryParams object
    var u = "lat=" + lat + "&lon=" + lon;

    // queryURL query the API
    UVqueryURL = "http://api.openweathermap.org/data/2.5/onecall?" + u + "&appid=" + queryParams;

    // UVURLquery()
    return UVqueryURL
};

function buildQueryURLCurrent() {

    // Set the API key
    var queryParams = "61921206a3d3feadf5aea21d13561e1e&units=imperial";
    // Grab text the user typed into the search input, add to the queryParams object
    var c = $("#citySearched").val()
    // queryURL query the API
    forcastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + c + "&appid=" + queryParams;

    // Logging the URL so we have access to it for troubleshooting
    console.log("---------------\nCURL: " + forcastURL + "\n---------------");

    return forcastURL;
};

function localStorageButtons(city) {

    savedCity = city.toLowerCase().replace(/\b[a-z]/g, function (letter) {
        return letter.toUpperCase();
    });

    var saveLocalStorage = JSON.stringify([forcastURL, UVqueryURL]);
    // saveLocalStorage = lsClean[0]

    localStorage.setItem(savedCity, saveLocalStorage);

}

$("#searchButton").on("click", function (event) {
    event.preventDefault();
    $("#weatherpage").removeClass("hide");
    //collect City name from Input
    city = $("#citySearched").val();
    //build array of cities
    // lsClean.push(city, forcastURL, UVqueryURL);
    // //manage array of cities, and rebuild local storage
    // if (localStorage.length > 5) {
    //     lsClean.pop()
    //     for (let i = 0; i < lsClean.length; i++) {
    //         localStorageButtons(lsClean[i]);
    //         for (let i = 0; i < localStorage.length; i++) {
    //             localStorage.setItem(lsCLean[i], );

    //         }
    //         localStorage.clear();
    //         for (let i = 0; i < lsClean.length; i++) {
    //             localStorageButtons(lsClean[i]);
    //         }
    //     }
    //     location.reload();
    // }

    //UNhide the main body
    //build URL's for the City chosen
    forcastURL = buildQueryURLCurrent();
    // FqueryURL = buildQueryURLFuture();

    currentURLquery()
    savedCity = city.toLowerCase().replace(/\b[a-z]/g, function (letter) {
        return letter.toUpperCase();
    });


    savedBArray.unshift(savedCity);
    createButtons(savedCity)


});

$("#newCityButtons").on("click", ".cityButton", function (id) {
    console.log("City Button Clicked");
    $("#weatherpage").removeClass("hide");
    var savedButtonCity = id.target.id;
    $("#citySearched").val(savedButtonCity);
    console.log(savedButtonCity);
    returnSaveSearchButtons(savedButtonCity);
});

// $(".cityButton").on("click", function(event) {
//     event.preventDefault();
//     console.log("City Button Clicked");
//     var savedButtonCity = $(this).attr("id");
//     console.log(savedButttonCity);
//     returnSaveSearchButtons(savedButtonCity);

// });

// Make the AJAX request to the API - GETs the JSON data at the queryURL.
// The data then gets pushed to an array.
function currentURLquery() {
    $.ajax({
        url: forcastURL,
        method: "GET"
    }).then(function (cresponse) {
        // console.log(`I AM RIGHT HERE ${CqueryURL}`)
        console.log(cresponse);

        city = $("#citySearched").val();
        savedCity = city.toLowerCase().replace(/\b[a-z]/g, function (letter) {
            return letter.toUpperCase();
        });
        localStorageButtons(savedCity);
        UVqueryURL = buildQueryURLUV(cresponse.city.coord.lat, cresponse.city.coord.lon)
        console.log("---------------\nuvURL: " + UVqueryURL + "\n---------------");
        //clear arrays
        currentWeather.splice(0, currentWeather.length);

        // //push API info into currentWeather array
        // currentWeather.push(savedCity);
        currentWeather.push({ "latitued": cresponse.city.coord.lat });
        currentWeather.push({ "Longitude": cresponse.city.coord.lon });
        //push API info into currentWeather array
        currentWeather.push(savedCity);
        pulledTime = cresponse.list[0].dt
        var d = new Date(pulledTime * 1000);
        var dt = d.toLocaleDateString();
        console.log("DATE IS:      " + dt)
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

        //gather 5 days of weather form API.
        fiveDayWeather.splice(0, fiveDayWeather.length);
        for (let i = 1; i < cresponse.list.length; i += 8) {


            pulled5Time = cresponse.list[i].dt
            var d = new Date(pulled5Time * 1000);
            var dt = d.toLocaleDateString();

            var icon = cresponse.list[i].weather[0].icon;
            var temp = cresponse.list[i].main.temp;
            var humidity = cresponse.list[i].main.humidity;


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
        console.log(uvresponse);
        UVIndex = uvresponse.current.uvi;
        currentWeather.push({ "UVIndex": UVIndex, })
        // pulledTime = uvresponse.current.dt
        // var d = new Date(pulledTime * 1000);
        // var dt = d.toLocaleDateString();
        // console.log("DATE IS:      " + dt)

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
//fucntion to update the main body TOP
function updatebody(city) {
    var currdate = new Date();
    var currdate = (currdate.getMonth() + 1) + '/' + currdate.getDate() + '/' + currdate.getFullYear();
    $("#currentCity").html(city + "  :   " + currentWeather[3].dt);
    updateWatherIcon("#Icon5", currentWeather[3].icon)
    $("#currentTemp").html(currentWeather[3].weather);
    $("#currentHumidity").html(currentWeather[3].humidity);
    $("#currentWindSpeed").html(currentWeather[3].windSpeed);
    $("#currentUVIndex").html(currentWeather[5].UVIndex);
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
//     for (let i = 1; i < fiveDayWeather.length; i++) {
//         var cardNum = "#Icon" + i;
//         var cardDate = fiveDayWeather[i].dt;
//         updateCardBody(cardNum, Item)
//     }
}
//Function to update the weather Icon based on the code given
function updateWatherIcon(iconNum, iconCode) {
    var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
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
//used to create the HTML buttons for saved searches
function createButtons(city) {
    var storedButtons = $("<button>");
    storedButtons.addClass("cityButton btn btn-light btn-lg btn-block");
    storedButtons.attr("ID", city);
    storedButtons.text(city)
    $("#newCityButtons").prepend(storedButtons);


}


// function savedButtons(cityname) {
//     console.log(cityname);
//     savedURLs = JSON.stringify(localStorage.getItem(savedCity));
//     savedCurrentURL = savedURLs[0];
//     savedfutureURL = savedURLs[1];
//     SavedUVIndesURL = savedURLs[2];
// }




// if (localStorage.getItem(4)) {
//     localStorageButtons(1);
// } else if (localStorage.getItem(3)) {
//     localStorageButtons(4);
// } else if (localStorage.getItem(2)) {
//     localStorageButtons(3);
// } else (localStorageButtons(4));




// .then(updatePage);


// function insertobjectCW(arr, obj) {
//     arr.push(obj);
// }