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

/*
$(".submit-city").submit(function(e) {
  $(".darken-detail").toggle();
});*/


/*
$(".opencity").click(function(e) {
  $(".darken-detail").show();
});*/


/* FOR ADDING A NEW CITY AND CLOSING OUT OF THE ADD PAGE */
$(".create-city-button").click(function(e){
  $(".darken-add-city").show();
});

$(".x").click(function(e) {//closes out without adding the new city since the user chose to x out of the page
  $(".darken-add-city").hide();
});

/*$(".submit-city").click(function(e) {//closes out when the user hits submit...not sure if this is necessary or how to implement??
  $(".darken-add-city").hide();
});*/

/* FUNCTIONS FOR CREATING AND RENDERING THE CITIES TO THE PAGE */

function getCity(userID, callback){//gets one city that the user clicks on
  
}

function getCities(user, callback){//gets all the cities when a signed in user goes to their dashboard
  $.ajax({
    type: 'GET',
    url: `/api/cities/`,//this needs an associated id of some kind to make sure we know whos cities we are planning to get
    headers: {
      'Content-Type': 'application/json',
    },
    datatype: 'json',
  });
}

function generateCityHTML(city){//generates the HTML for each individual city
   return `<div class="city-card"><p class="cityname">${city.cityName}</p></div>`;
}

function renderCities(cities){//renders all of the cities to the page using the generateCityHTML function
  cities.forEach((city) => {//for each city in cities, use append to call generateCityHTML and return the HTML
    $('.citiescontainer').append(generateCityHTML(city));
  });
}

function handleCityClicked(){//brings up the city detail page, recall that the lab will be on the image so image needs to be darkened
  $('.city-card').on('click', function(e){//when a city card div is clicked, open that city card
    console.log('city clicked');
    $('.darken-detail').show();
  });
}

function handleUpdateCityClicked(){//handles user requests to update a given city
  $('.edit-city').on('click', function(){//when the edit city button is clicked, allow the edits to be made
    //make all fields editable
    //make a put request with the updated information from all of the fields
    updateCity(updatedCityObject);
  });
}

function updateCity(updatedCity){
//ajax put request
  $.ajax({
    type: 'PUT',
    url: `/api/cities`,
    data: JSON.stringify(updatedCity),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .done(function(response){
    callback(response);
  })
  .fail(function(err){
    generateError(err);
  })
}

function handleDeleteCityClicked(id){//handles user requests to delete a given city
  $('.delete-city').on('click', function(){//when the delete city button is clicked, the city will be deleted
    deleteCity();//need to figure out how to target the specific city that we want to delete in order to pass it in...target it then store it in a variable
    //once this is working well, consider adding an "are you sure?" kind of popup box to confirm
  });
}

function deleteCity(){
  $.ajax({
    type: 'DELETE',
    url: `/api/cities/${id}`,
    data: JSON.stringify(deleteCity),
    headers: {
      'Content-Type': 'application/json',
    },
    datatype: 'json',
  });
}


function handleFormSubmit(){//empties the form and calls createCity when the user decides to add a new city
//should I call this inside of the post request?? or somewhere else? It probably shouldnt empty everything if the request fails or there is an error
}

function getCheckboxValues(){//gets the values of whatever is checked in the checkboxes
    let checkedVals = [];
    $('input[type=checkbox]:checked').each(function(){
      checkedVals.push($(this).val());
    });
    console.log(checkedVals);
    return checkedVals;
}


function createCityObject(){
  $('form').on('submit', function(){//be sure to have a condition that checks to see if all of the required fields are filled out
    console.log('Just checking to see if anything is happening!!!!');
    //set all of the variables to whatever is inside of the form submission

    let cityName = $("#cityName").val();
    let country = $("#country").val();
    let yearVisited = $("#yearVisited").val();
    let notes = $("#notes").val();
    let tags = getCheckboxValues();
    let imageURL = $("#imageURL").val();

    console.log(`${cityName}, ${country}, ${yearVisited}, ${notes}, ${tags}, ${imageURL}`);

    let newCity = {//creates a new city object using the information stored above
      cityName:cityName,
      country:country,
      yearVisited:yearVisited,
      notes:notes,
      tags:tags,
      image:imageURL
    }
    //$('.darken-detail').hide();//why isnt this working?????
    console.log(newCity);
    storeCity(newCity, generateCityHTML);
  });
}

function storeCity(city, callback){//creates a new city using the form data inputted
     console.log(city);

    $.ajax({
      type: 'POST',
      url: `/api/cities`,
      data: JSON.stringify(city),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .done(function(response){
      callback(response);
    })
    .fail(function(err){
      generateError(err);
    })
}



/*FUNCTIONS RELATED TO ERROR HANDLING */

function generateError(error){//generates an error if necessary
  console.error(error)
}

/*FUNCTIONS RELATING TO RENDERING PINS OF THE CITIES ON THE MAP */


$(function () {
handleFormSubmit();
createCityObject();
handleUpdateCityClicked();
handleDeleteCityClicked();
handleCityClicked();
});