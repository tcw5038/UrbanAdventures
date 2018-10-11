"use strict";
/* global $ */

let state = {
  cities : [],
  selectedCityIndex: -1,//not 0 because 0 is currently a city
  markers:[]
}

/*FOR HIDING AND SHOWING THE CITIES BESIDE THE MAP */

$(".toggle-list").click(function(e) {
  $(".citiescontainer").toggle();
});

/*GOOGLE MAPS */
//https://developers.google.com/maps/documentation/javascript/examples/geocoding-simple
var geocoder;
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
  geocoder = new google.maps.Geocoder();
  // geocodeAddress(geocoder, map)
}

function clearMarkers() {
    for(var i=0; i < state.markers.length; i++){
        state.markers[i].setMap(null);
    }
    state.markers = new Array();
};


/*function getPosition(){
$.ajax({
type:'GET',
url: `https://maps.googleapis.com/maps/api/geocode/`,
address:'atlanta',
format:'json',
headers:{
'Content-type':'application/json',
'Access-Control-Allow-Origin': '*',
'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
}
})
.done(function(response){
console.log(response);
});

}*/

function displayMarkers(){//loops through and creates a marker for each country

}

/* CLICK EVENT LISTENERS*/


$(".x").click(function(e) {//closes out without adding the new city since the user chose to x out of the page
  $(".darken-add-city").hide();
});

$(".x").click(function(e) {//closes out without adding the new city since the user chose to x out of the page
  $(".darken-edit").hide();
});

$(".create-city-button").click(function(e){
  $(".darken-add-city").show();
});

$('.edit-city-container').on('click', '.x', function(event){//closes out without adding the new city since the user chose to x out of the page
  $(".darken-edit").hide();
});

$('.city-detail-container').on('click', '.x', function(event){//closes out without adding the new city since the user chose to x out of the page
  $(".darken-detail").hide();
});



/* FUNCTIONS FOR CREATING AND RENDERING THE CITIES TO THE PAGE */

function generateTagHTML (tag){
  return `<li class="tag"><div class="tag-box">${tag}</div></li>`
}

function renderTags(city){
  let checkedTags = city.tags;
  let renderedTags = checkedTags.map((tag) => {//for each city in cities, use append to call generateCityHTML and return the HTML
    return generateTagHTML(tag);
  });
  return renderedTags;
}

function renderCityDetailPage(city){//pulls data from cityObject and renders it as the detail page
  let tagCode = renderTags(city);

  return `
  <span class="x">X</span>
  <h1 class="cityName">${city.cityName}, ${city.country}</h1>
  <h3 class="yearVisited">${city.yearVisited}</h3>
  <img class="detailimg" src="${city.imageURL}">
  <ul class="tag-list">
  ${tagCode.join(" ")}
  </ul>
  <div class="notes">${city.notes}</div>
  <button class="edit-city">Edit this city</button>
  <button class="delete-city">Delete this city</button>
  `
}

function generateCityHTML(city, index){//generates the HTML for each individual city
  return `<div class="city-card" data-index="${index}" style="background-image:url(${city.imageURL})">
  <div class="darken-filter"></div>
  <h1 class="city-name">${city.cityName}</h1>
  </div>`;//make it a div with an img as a background, background size to cover
}

function getCities(){//gets all the cities when a signed in user goes to their dashboard
  $.ajax({
    type: 'GET',
    url: `/api/cities/`,
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .done(function(response){
    console.log("Rendering cities");
    state.cities = response;

    renderCities(state.cities);
  })
  .fail(function(err){
    generateError(err);
  })
}
function createMarker(city, index){//creates a new marker on the google map
  var marker = new google.maps.Marker({
    position: city.location,
    map: map,
    title: city.cityName
    //infowindow: myinfowindow,
    //contentString: contentString,
    //icon: 'images/pin.png'
  });
  state.markers.push(marker)
}

function renderCities(cities){//renders all of the cities to the page using the generateCityHTML function
  clearMarkers()
  let renderedCities = cities.map((city, index) => {//for each city in cities, use append to call generateCityHTML and return the HTML
    createMarker(city)
    return generateCityHTML(city, index);
  });
  $('.citiescontainer').html(renderedCities);
}

function handleCityClicked(){//listener that brings up the city detail page on click, recall that the title will be on the image so image needs to be darkened
  $('.citiescontainer').on('click', '.city-card', function(event){
    event.preventDefault();
    let cityIndex = $(this).attr("data-index");//stores the index of this city in a variable
    let selectedCity = state.cities[cityIndex];
    state.selectedCityIndex = cityIndex;
    let renderedDetailPage = renderCityDetailPage(selectedCity);//takes the data from selectedCity and uses it to populate the detail page
    $('.city-detail-container').html(renderedDetailPage);
    $('.darken-detail').show();
  });
}

function createUpdateFields(selectedCity){//returns a new form that the user can use to update their city
  //had to use return false in the form or it would keep refreshing the page...not sure why?
  return `
  <span class="x">X</span>
  <form class="edit-city-form">
  <h1 class="add-city-title">Edit this city</h1>
  <label for="cityName">City Name:</label>
  <input type="text" name="cityName" id="cityName" value="${selectedCity.cityName}"required>
  <label for="country">Country:</label>
  <input type="text" value="${selectedCity.country}" name="country" id="country" required>
  <label for="yearVisited">Year of visit:</label>
  <input type="text" value="${selectedCity.yearVisited}" name="yearVisited" id="yearVisited" required>
  <label for="tags">Tag this city with things you will remember it for by checking boxes below (as many as you would like):</label>
  <input type="checkbox" value="food" class="checkbox"> Food
  <input type="checkbox" value="architecture" class="checkbox"> Architecture
  <input type="checkbox" value="art" class="checkbox"> Art
  <input type="checkbox" value="people" class="checkbox"> People
  <input type="checkbox" value="nature" class="checkbox"> Nature
  <input type="checkbox" value="good-value" class="checkbox"> Good value
  <br>
  <label for="image">Add a link to an image of this city:</label>
  <input type="url" value="${selectedCity.imageURL}" name="image"  id="imageURL" required>
  <label for="notes">Add any notes about this city:</label>
  <input type="text" value="${selectedCity.notes}" name="notes" id="notes">
  <input type="submit" class="submit-updates" value="Update this city">
  </form>`;//include all the parts of the form, pre filled in with the previous values so that they can be updated
}

function handleEditThisCityClicked(){//handles user requests to update a given city
  $('.city-detail-container').on('click', '.edit-city', function(event){//when the edit city button is clicked, allow the edits to be made
    let cityIndex = state.selectedCityIndex;
    let selectedCity = state.cities[cityIndex];
    let cityID = selectedCity.id;
    let editableCityHTML = createUpdateFields(selectedCity);
    $(".edit-city-container").html(editableCityHTML);
    $(".darken-detail").hide();//hides the detail page
    $(".darken-edit").show();//shows the update page
  });
}

function handleUpdateCityClicked(){//used when the user decides to hit the update city button after changing data
  $('.edit-city-container').on('click', '.submit-updates', function(event){
    event.preventDefault();
    let cityIndex = state.selectedCityIndex;
    let selectedCity = state.cities[cityIndex];
    let cityID = selectedCity.id;
    let cityName = $("#cityName").val();
    let country = $("#country").val();
    let yearVisited = $("#yearVisited").val();
    let notes = $("#notes").val();
    let tags = getCheckboxValues();
    let imageURL = $("#imageURL").val();

    let updatedCity = {//creates a new city object using the information stored above
      cityName:cityName,
      country:country,
      yearVisited:yearVisited,
      notes:notes,
      tags:tags,
      imageURL:imageURL,
      id:cityID
    }
    //state.cities[cityIndex] = updatedCity;
    $(".darken-edit").hide();
    updateCity(updatedCity, cityID);//put request with the id and the update data

  });
}

function updateCity(updatedCity, cityID){//pass in the updatedCity and the cityID

  $.ajax({
    type: 'PUT',
    url: `/api/cities/${cityID}`,
    data: JSON.stringify(updatedCity),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(() => {
    getCities();
    console.log("Successfully updated city");
  })
  .fail(function(err){
    generateError(err);
  })
}

/*FUNCTIONS FOR DELETING A CITY OBJECT */
function handleDeleteCityClicked(){//handles user requests to delete a given city
  $('.city-detail-container').on('click', '.delete-city', function(event){//when the delete city button is clicked, the city will be deleted
    event.preventDefault();
    let cityIndex = state.selectedCityIndex;
    let selectedCity = state.cities[cityIndex];
    let cityID = selectedCity.id;
    deleteCity(cityID);
  });
}

function deleteCity(id){//still need to figure out how we are acquiring this id
  $.ajax({
    type: 'DELETE',
    url: `/api/cities/${id}`,
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(() => {
    getCities();
    $(".darken-detail").hide();
    console.log("Successfully deleted city");
  })
  .fail(() => {
    console.log("Failed to delete cities");
  })
};

/*FUNCTIONS FOR CREATING A NEW CITY OBJECT*/

function getCheckboxValues(){//gets the values of whatever is checked in the checkboxes
  let checkedVals = [];
  $('input[type=checkbox]:checked').each(function(){
    checkedVals.push($(this).val());
  });
  return checkedVals;
}


function createCityObject(){
  $('#add-city-form').on('submit', function(event){//be sure to have a condition that checks to see if all of the required fields are filled out
    event.preventDefault();
  //  console.log('Just checking to see if anything is happening!!!!');
    //set all of the variables to whatever is inside of the form submission

    let cityName = $("#cityName").val();
    let country = $("#country").val();
    let yearVisited = $("#yearVisited").val();
    let notes = $("#notes").val();
    let tags = getCheckboxValues();
    let imageURL = $("#imageURL").val();

    //console.log(`${cityName}, ${country}, ${yearVisited}, ${notes}, ${tags}, ${imageURL}`);

    let newCity = {//creates a new city object using the information stored above
      cityName:cityName,
      country:country,
      yearVisited:yearVisited,
      notes:notes,
      tags:tags,
      imageURL:imageURL,
      location:{}
    }
    findCityLocation(newCity)

  });
}


function findCityLocation(city){
  geocoder.geocode({'address': `${city.cityName}, ${city.country}`}, function(results, status) {
    if (status === 'OK') {
      city.location.lat=results[0].geometry.location.lat();
      city.location.lng=results[0].geometry.location.lng();
      storeCity(city)
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}


function storeCity(city){//creates a new city using the form data inputted
  $.ajax({
    url: `/api/cities/`,
    type: 'POST',
    data: JSON.stringify(city),
    headers: {
      'Content-Type': 'application/json',
      //'Authorization':'Bearer ' + token //token from local storage
    },
  })
  .then(() => {
    $(".darken-add-city").hide();
    getCities();
  })
  .fail(error => {
    generateError(error);
  })
};

/*FUNCTIONS RELATED TO ERROR HANDLING */

function generateError(error){//generates an error if necessary
  console.error(error)
}


$(function () {
  createCityObject();
  handleCityClicked();
  handleEditThisCityClicked();
  handleUpdateCityClicked();
  handleDeleteCityClicked();
  getCities();




  //getPosition();

});
