"use strict";
/* global $ */

let state = {
  cities : [],
  selectedCityIndex: -1//not 0 because 0 is currently a city
}

/*FOR HIDING AND SHOWING THE CITIES BESIDE THE MAP */

$(".toggle-list").click(function(e) {
  $(".citiescontainer").toggle();
});

/*GOOGLE MAPS */
//https://developers.google.com/maps/documentation/javascript/examples/geocoding-simple

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

function createMarker(latlon, pageTitle, contentString){//creates a new marker on the google map
  var marker = new google.maps.Marker({
    position: latlon,//need to likely make something like getPosition() function that returns lat and longitude
    map: map,
    title: pageTitle,
    infowindow: myinfowindow,
    contentString: contentString,
    //icon: 'images/pin.png'
});
}

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

$(".submit-city").click(function(e) {//closes out when the user hits submit...do we need additional user feedback here?
  $(".darken-add-city").hide();
});

/* FUNCTIONS FOR CREATING AND RENDERING THE CITIES TO THE PAGE */

function generateTagHTML (tag){
  return `<li class="tag">${tag}</li>`
}

function renderTags(city){
  let checkedTags = city.tags;
  let renderedTags = checkedTags.map((tag) => {//for each city in cities, use append to call generateCityHTML and return the HTML
    console.log(tag);
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
  ${tagCode.join(", ")}
  </ul>
  <div class="notes">${city.notes}</div>
 <button class="edit-city">Edit this city</button>
 <button class="delete-city">Delete this city</button>
`}

function generateCityHTML(city, index){//generates the HTML for each individual city
   return `<div class="city-card" data-index="${index}">
   <p class="city-name">${city.cityName}</p>
   <img class="city-img" src="${city.imageURL}">
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

function renderCities(cities){//renders all of the cities to the page using the generateCityHTML function
  let renderedCities = cities.map((city, index) => {//for each city in cities, use append to call generateCityHTML and return the HTML
    return generateCityHTML(city, index);
  });
  $('.citiescontainer').html(renderedCities);
}

function handleCityClicked(){//listener that brings up the city detail page on click, recall that the title will be on the image so image needs to be darkened
  $('.citiescontainer').on('click', '.city-card', function(event){
    event.preventDefault();
    let cityIndex = $(this).attr("data-index");//stores the index of this city in a variable
    console.log(cityIndex);
    let selectedCity = state.cities[cityIndex];
    state.selectedCityIndex = cityIndex;
    console.log(selectedCity);
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
    console.log(cityIndex);
    let selectedCity = state.cities[cityIndex];
    let cityID = selectedCity.id;
    console.log(cityID);
    let editableCityHTML = createUpdateFields(selectedCity);
    console.log(editableCityHTML);
    $(".edit-city-container").html(editableCityHTML);
    $(".darken-detail").hide();//hides the detail page
    $(".darken-edit").show();//shows the update page
    console.log("Made it here");
    
  });
}

function handleUpdateCityClicked(){//used when the user decides to hit the update city button after changing data
  $('.edit-city-container').on('click', '.submit-updates', function(event){
    event.preventDefault();
    console.log("Update city button clicked!");
    let cityIndex = state.selectedCityIndex;
    console.log(cityIndex);
    let selectedCity = state.cities[cityIndex];
    let cityID = selectedCity.id;
    console.log(selectedCity);
   
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
      imageURL:imageURL
    }
    console.log(updatedCity);
    updateCity(updatedCity, cityID);//put request with the id and the update data
  });
}

function updateCity(updatedCity, cityID){//pass in the updatedCity and the cityID
  console.log(cityID);
  console.log(updatedCity);
//ajax put request
  $.ajax({
    type: 'PUT',
    url: `/api/cities/${cityID}`,
    data: JSON.stringify(updatedCity),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .done(function(){
    console.log("Updating city");
    getCities();//once the city is done being updated, call the getCities function to display the updated results
  })
  .fail(function(err){
    generateError(err);
  })
}


function handleDeleteCityClicked(){//handles user requests to delete a given city
  $('.city-detail-container').on('click', '.delete-city', function(event){//when the delete city button is clicked, the city will be deleted
    event.preventDefault();
    let cityIndex = state.selectedCityIndex;
    console.log(cityIndex);
    let selectedCity = state.cities[cityIndex];
    let cityID = selectedCity.id;
    console.log(cityID);
    //console.log(state.cities);
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
    console.log("Successfully deleted city");
  })
  .fail(() => {
    console.log("Failed to delete cities");
  })
};

function getCheckboxValues(){//gets the values of whatever is checked in the checkboxes
    let checkedVals = [];
    $('input[type=checkbox]:checked').each(function(){
      checkedVals.push($(this).val());
    });
    console.log(checkedVals);
    return checkedVals;
}


function createCityObject(){
  $('#add-city-form').on('submit', function(event){//be sure to have a condition that checks to see if all of the required fields are filled out
    event.preventDefault();
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
      imageURL:imageURL
    }
    console.log(newCity);
    storeCity(newCity);//call the storeCity function to add our new city to the database
  });
}

function storeCity(city){//creates a new city using the form data inputted
    console.log(city);
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
      console.log(city);
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