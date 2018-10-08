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

/* CLICK EVENT LISTENERS*/
$(".x").click(function(e) {
  $(".darken-detail").hide();
});

$(".x").click(function(e) {//closes out without adding the new city since the user chose to x out of the page
  $(".darken-add-city").hide();
});

$(".create-city-button").click(function(e){
  $(".darken-add-city").show();
});

/*
$(".darken-detail").click(function(e) {//closes out without adding the new city since the user chose to x out of the page
  $(".darken-detail").hide();
});

$(".darken-add-city").click(function(e) {//closes out without adding the new city since the user chose to x out of the page
  $(".darken-add-city").hide();
});*/

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
  ${tagCode}
  </ul>
  <div class="notes">${city.notes}</div>
 <button class="edit-city" type="submit">Edit this city</button>
 <button class="delete-city" type="submit">Delete this city</button>
`

   //$('.darken-detail').show();
}

//seems like I might not even need this getCity function
/*function getCity(){//gets one city that the user clicks on
  $.ajax({
    type: 'GET',
    url: `/api/cities`,
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .done(function(response){
    //need something here still
  })
  .fail(function(err){
    generateError(err);
  })
}*/

function getCities(){//gets all the cities when a signed in user goes to their dashboard
  $.ajax({
    type: 'GET',
    url: `/api/cities`,
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

function generateCityHTML(city, index){//generates the HTML for each individual city
  //what would be the best way to make the image output properly for this city?
   return `<div class="city-card" data-index="${index}">
   <p class="city-name">${city.cityName}</p>
   <img class="city-img" src="${city.imageURL}">
   </div>`;//make it a div with an img as a background, background size to cover
}

function renderCities(cities){//renders all of the cities to the page using the generateCityHTML function
  let renderedCities = cities.map((city, index) => {//for each city in cities, use append to call generateCityHTML and return the HTML
    return generateCityHTML(city, index);
  });
  $('.citiescontainer').html(renderedCities);
}

/*function createUpdateFields(){//returns a new form that the user can use to update their city
  //STILL NEED TO FIX THIS WITH THE PROPER VALUES AND FIGURE OUT HOW I WANT TO STORE THEM
  return ``;//include all the parts of the form, pre filled in with the previous values so that they can be updated
}*/

function handleUpdateCityClicked(){//handles user requests to update a given city
  $('.edit-city').on('click', function(){//when the edit city button is clicked, allow the edits to be made
    //make all fields editable
    //make a put request with the updated information from all of the fields
    createUpdateFields();
    //then we need a function to store the updated city object
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
  .done(function(){
    console.log(updatedCity);
    getCities();//once the city is done being updated, call the getCities function to display the updated results
  })
  .fail(function(err){
    generateError(err);
  })
}

function handleCityClicked(){//listener that brings up the city detail page on click, recall that the title will be on the image so image needs to be darkened
  $('.citiescontainer').on('click', '.city-card', function(event){
    let cityIndex = $(this).attr("data-index");//stores the index of this city in a variable
    console.log(cityIndex);
    let selectedCity = state.cities[cityIndex];
    state.selectedCityIndex = cityIndex;
    console.log(selectedCity);
    let renderedDetailPage = renderCityDetailPage(selectedCity);//takes the data from selectedCity and uses it to populate the detail page
    $('.city-detail-container').html(renderedDetailPage);
    $('.darken-detail').show();
    $(".x").click(function(e) {//closes out without adding the new city since the user chose to x out of the page
      $(".darken-detail").hide();
    });

    //handleDeleteCityClicked(cityIndex);
    //handleUpdateCityClicked(cityIndex);
  });
}

function handleDeleteCityClicked(){//handles user requests to delete a given city
  $('.city-detail-container').on('click', '.delete-city', function(event){//when the delete city button is clicked, the city will be deleted
    let cityIndex = state.selectedCityIndex;
    console.log(cityIndex);
    let selectedCity = state.cities[cityIndex];
    let cityID = selectedCity.id;
    console.log(cityID);
    //console.log(state.cities);
    deleteCity(cityID);
    //once this is working well, consider adding an "are you sure?" kind of popup box to confirm
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
  $('form').on('submit', function(event){//be sure to have a condition that checks to see if all of the required fields are filled out
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

/*FUNCTIONS RELATING TO RENDERING PINS OF THE CITIES ON THE MAP */


$(function () {
handleFormSubmit();
createCityObject();
handleUpdateCityClicked();
handleDeleteCityClicked();
getCities();
handleCityClicked();
});