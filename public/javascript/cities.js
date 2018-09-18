"use strict";
/* global $ */

/*FOR HIDING AND SHOWING THE CITIES BESIDE THE MAP */
$(".close").click(function(e) {
  $(".citiescontainer").hide();
});

$(".open").click(function(e) {
  $(".citiescontainer").show();
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

}

function generateCityHTML(){//generates the HTML for each individual city

}

function renderCities(){//renders all of the cities to the page using the generateCityHTML function

}

function handleCityClicked(){//brings up the city detail page

}



function handleFormSubmit(){//empties the form and calls createCity when the user decides to add a new city

}

function createCity(){//creates a new city using the form data inputted

}

/*FUNCTIONS RELATED TO ERROR HANDLING */

function generateError(){//generates an error if necessary

}

/*FUNCTIONS RELATING TO RENDERING PINS OF THE CITIES ON THE MAP */