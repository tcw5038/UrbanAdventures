"use strict";
/* global $ */

/*FOR HIDING AND SHOWING THE CITIES BESIDE THE MAP */

$(".toggle-list").click(function(e) {
  $(".citiescontainer").toggle();
});

/*FOR INITIALIZING GOOGLE MAPS */
let map;
function initMap(data) {
  let lat = 0;
  let lng = 0;
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: lat, lng: lng },
    zoom: 4,
    draggable: true,
    zoomControl: true,
    scrollWheel: false,
    gestureHandling: "greedy"
  });
}

/* FOR OPENING AND CLOSING CITY DETAIL PAGES */
$(".x").click(function(e) {
  $(".darken-detail").hide();
});

$(".opencity").click(function(e) {
  $(".darken-detail").show();
});


/* FOR ADDING A NEW CITY AND CLOSING OUT OF THE ADD PAGE */
$(".create-city-button").click(function(e){
  $(".darken-add-city").show();
});

$(".x").click(function(e) {//closes out without adding the new city since the user chose to x out of the page
  $(".darken-add-city").hide();
});

$(".submit-city").click(function(e) {//closes out when the user hits submit...not sure if this is necessary or how to implement??
  $(".darken-add-city").hide();
});

/* FUNCTIONS FOR CREATING AND RENDERING THE CITIES TO THE PAGE */

function getCities(){//gets all the cities associated with a given user ID
//make a get request to cities and then render them to the page via a different function
$.get(`/cities/` + $('.userID'.val(), (cities) => {//where should my user ID come from?
  renderCities(cities);//once we get all the cities, we call renderCities
}));
}

function generateCityHTML(city){//generates the HTML for each individual city
   return `<div class="city-card"><p class="cityname">${city.name}</p></div>`
}

function renderCities(cities){//renders all of the cities to the page using the generateCityHTML function
  cities.forEach((city) => {
    $('.citiescontainer').append(generateCityHTML(city));
  });
}

function handleCityClicked(){//brings up the city detail page, recall that the lab will be on the image so image needs to be darkened
  $('')

}



function handleFormSubmit(){//empties the form and calls createCity when the user decides to add a new city
//should I call this inside of the post request?? or somewhere else? It probably shouldnt empty everything if the request fails or there is an error
}

function createCity(){//creates a new city using the form data inputted
  $('.submit-city').on('click', function(){//be sure to have a condition that checks to see if all of the required fields are filled out
    event.preventDefault();
    //set all of the variables to whatever is inside of the form submission

    let cityName = $("#cityName").val();
    let country = $("#country").val();
    let yearVisited = $("date").val();
    let notes = $("notes").val();
    let imageURL = $("imageURL").val();

    console.log(`${cityName}, ${country}, ${yearVisited}, ${notes}, ${imageURL}`)//just for testing purposes

    let newCity = {//creates a new city object using the information stored above
      name:cityName,
      country:country,
      yearVisited:yearVisited,
      notes:notes,
      image:imageURL
    }

    $.ajax({//POST request for adding the new city to the database of cities
      type: "POST",//make sure to fix these based on whatever I decide
      url: `/cities`,
      data: JSON.stringify(newCity),
      success: function(response){
        $('.citiescontainer').append(generateCityHTML(response.data));//generates the new city based on the response data
      },
      fail: function(response) {
        console.error(response);
      }
    });
  });
}

/*FUNCTIONS RELATED TO ERROR HANDLING */

function generateError(){//generates an error if necessary

}

/*FUNCTIONS RELATING TO RENDERING PINS OF THE CITIES ON THE MAP */