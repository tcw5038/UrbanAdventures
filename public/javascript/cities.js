'use strict';
/* global $ */

let state = {
  cities : [],
  selectedCityIndex: -1,//not 0 because 0 is currently a city
  markers:[]
}


let token = localStorage.getItem('authToken');
//https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem

//if there is no token, redirect to landing page
//if there is a token, try to refresh the token
//if successful, continue as normal
//if unsucessful, redirect to login and delete the token from local storage

/*GOOGLE MAPS */
//https://developers.google.com/maps/documentation/javascript/examples/geocoding-simple
var geocoder;
let map;
function initMap(data) {//initializes google maps for use with cities
  let lat = 0;
  let lng = 0;
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: lat, lng: lng },
    zoom: 4,
    draggable: true,
    zoomControl: true,
    scrollWheel: false,
    gestureHandling: 'greedy'
  });
  geocoder = new google.maps.Geocoder();
}

function clearMarkers() {//clears google maps markers
    for(var i=0; i < state.markers.length; i++){
        state.markers[i].setMap(null);
    }
    state.markers = new Array();
};

function findCityLocation(city){//gets latitude and longitude of a given city then calls storeCity to store the city
  geocoder.geocode({'address': `${city.cityName}, ${city.country}`}, function(results, status) {
    if (status === 'OK') {
      city.location.lat=results[0].geometry.location.lat();
      city.location.lng=results[0].geometry.location.lng();
      saveCity(city)
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function createMarker(city, index){//creates a new marker on the google map using information from the city object
  var marker = new google.maps.Marker({
    position: city.location,
    map: map,
    title: city.cityName
  });
  state.markers.push(marker)
}

/* CLICK EVENT LISTENERS*/


$('.x').click(function(e) {//closes out without adding the new city since the user chose to x out of the page
  $('.darken-add-city').hide();
  $('.toggle-button-div').show();
});

$('.x').click(function(e) {//closes out without editing the city since the user chose to x out of the page
  $('.darken-edit').hide();
  $('.toggle-button-div').show();
});

$('.create-city-button').click(function(e){//opens modal for adding a new city
  $('.darken-add-city').show();
  $('.toggle-button-div').hide();
});

$('.edit-city-container').on('click', '.x', function(event){//closes out without editing the new city since the user chose to x out of the page
  $('.darken-edit').hide();
  $('.toggle-button-div').show();
});

$('.city-detail-container').on('click', '.x', function(event){//closes out without adding the city since the user chose to x out of the page
  $('.darken-detail').hide();
  $('.toggle-button-div').show();
});


function handleToggleClicked(){
  $('.toggle-button-div').on('click', '#toggle-list', function(e) {
    let button = $('#toggle-list');
      if (button.attr('data-value')==='show'){
		    $('.toggle-button-div').addClass('button-left');
        button.html('Show List View');
        button.attr('data-value', 'hide');
        $('.citiescontainer').toggle();
      }
      else {
		    $('.toggle-button-div').removeClass('button-left');
        button.attr('data-value', 'show');
        button.html('Hide List View');
        $('.citiescontainer').toggle();
      }
  });
}

/* FUNCTIONS FOR RENDERING THE CITIES TO THE PAGE */

function generateTagHTML (tag){//generates HTML for a given tag
  return `<li class='tag'><div class='tag-box'>${tag}</div></li>`;
}

function renderTags(city){//returns HTML code for each tag that was checked for a given city
  let checkedTags = city.tags;
  let renderedTags = checkedTags.map((tag) => {
    return generateTagHTML(tag);
  });
  return renderedTags;
}

function renderCityDetailPage(city){//pulls data from the city object and renders it as the detail page
  let tagCode = renderTags(city);

  return `
  <span class='x'>X</span>
  <h1 class='cityName'>${city.cityName}, ${city.country}</h1>
  <h3 class='yearVisited'>${city.yearVisited}</h3>
  <img class='detailimg' src='${city.imageURL}'>
  <ul class='tag-list'>
  ${tagCode.join(' ')}
  </ul>
  <div class='notes'>${city.notes}</div>
  <button class='edit-city'>Edit this city</button>
  <button class='delete-city'>Delete this city</button>
  `
}

function generateCityHTML(city, index){//generates the HTML for each individual city
  return `<div class='city-card' data-index='${index}' style='background-image:url(${city.imageURL})'>
  <div class='darken-filter'></div>
  <h1 class='city-name'>${city.cityName}</h1>
  </div>`;//make it a div with an img as a background, background size to cover
}

function getCities(){//gets all the cities when a signed in user goes to their dashboard or does any other action that alters a city
  $.ajax({
    type: 'GET',
    url: `/api/cities/`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${token}`
    },
  })
  .done(function(response){
    state.cities = response;
    renderCities(state.cities);
  })
  .fail(function(err){
    generateError(err);
  })
}


function renderCities(cities){//maps through all of the cities generating HTML code, then renders it to the page
  clearMarkers()
  let renderedCities = cities.map((city, index) => {
    createMarker(city)
    return generateCityHTML(city, index);
  });
  if(renderedCities.length){
    $('.citiescontainer').html(renderedCities);
  }
  else{
    $('.citiescontainer').html(`<div class='empty-state'>Start by creating a city using the add city button above.</div>`);
  }
  
}

/*FUNCTION FOR CREATING AND UPDATING CITY (PUT/POST) */
function saveCity(city){//creates a new city using the form data inputted
  let cityID = city.id ? city.id : ';
  let method = city.id ? 'PUT' : 'POST';
  $.ajax({
    type: method,
    url: `/api/cities/${cityID}`,
    data: JSON.stringify(city),
    headers: {
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${token}`
    },
  })
  .then(() => {
    $('.darken-add-city').hide();
    getCities();
  })
  .fail(error => {
    generateError(error);
  })
};

/* FUNCTIONS FOR TARGETING AND CHANGING INDIVIDUAL CITIES */

function handleCityClicked(){//listener that brings up the city detail page on click
  $('.citiescontainer').on('click', '.city-card', function(event){
    event.preventDefault();
    let cityIndex = $(this).attr('data-index');//stores the index of this city in a variable
    let selectedCity = state.cities[cityIndex];
    state.selectedCityIndex = cityIndex;
    let renderedDetailPage = renderCityDetailPage(selectedCity);//takes the data from selectedCity and uses it to populate the detail page
    $('.city-detail-container').html(renderedDetailPage);
    $('.toggle-button-div').hide();
    $('.darken-detail').show();
  });
}

function createUpdateFields(selectedCity){//returns a new form that the user can use to update their city
  return `
  <span class='x'>X</span>
  <form class='edit-city-form'>
  <h1 class='add-city-title'>Edit this city</h1>
  <label for='cityName'>City Name:</label>
  <input type='text' name='cityName' id='cityName' value='${selectedCity.cityName}'required>
  <label for='country'>Country:</label>
  <input type='text' value='${selectedCity.country}' name='country' id='country' required>
  <label for='yearVisited'>Year of visit:</label>
  <input type='text' value='${selectedCity.yearVisited}' name='yearVisited' id='yearVisited' required>
  <label for='tags'>Tag this city with things you will remember it for by checking boxes below (as many as you would like):</label>
    <ul class='checkbox-grid'>
                        <li><input type='checkbox' value='Food' class='checkbox'> Food</li>
                        <li><input type='checkbox' value='Architecture' class='checkbox'> Architecture</li>
                        <li><input type='checkbox' value='Art' class='checkbox'> Art</li>
                        <li><input type='checkbox' value='People' class='checkbox'> People</li>
                        <li><input type='checkbox' value='Nature' class='checkbox'> Nature</li>
                        <li><input type='checkbox' value='Good-value' class='checkbox'> Good Value</li>
    </ul>
  <br><br><br>
  <label for='image'>Add a link to an image of this city:</label>
  <input type='url' value='${selectedCity.imageURL}' name='image'  id='imageURL' required>
  <label for='notes'>Add any notes about this city:</label>
  <input type='text' value='${selectedCity.notes}' name='notes' id='notes'>
  <input type='submit' class='submit-updates' value='Update this city'>
  </form>
  <div class='error-message-update'></div>`;
}

function handleEditThisCityClicked(){//handles user clicks on the detail page for editing a given city
  $('.city-detail-container').on('click', '.edit-city', function(event){//when the edit city button is clicked, allow the edits to be made
    let cityIndex = state.selectedCityIndex;
    let selectedCity = state.cities[cityIndex];
    let cityID = selectedCity.id;
    let editableCityHTML = createUpdateFields(selectedCity);
    $('.edit-city-container').html(editableCityHTML);
    $('.darken-detail').hide();//hides the detail page
    $('.darken-edit').show();//shows the update page
  });
}

function handleUpdateCityClicked(){//used when the user decides to hit the update city button after changing data in the form
  $('.edit-city-container').on('click', '.submit-updates', function(event){
    event.preventDefault();
    let cityIndex = state.selectedCityIndex;
    let selectedCity = state.cities[cityIndex];
    let cityID = selectedCity.id;
    let cityName = $('#cityName').val();
    let country = $('#country').val();
    if(isNaN($('#yearVisited').val())){
      $('.error-message-update').html('Please insert a valid year.');
    }
    else{
        let yearVisited = $('#yearVisited').val();
        let notes = $('#notes').val();
        let tags = getCheckboxValues();
        let imageURL = $('#imageURL').val();

        let updatedCity = {
          cityName:cityName,
          country:country,
          yearVisited:yearVisited,
          notes:notes,
          tags:tags,
          imageURL:imageURL,
          id:cityID
      }
      $('.darken-edit').hide();
      saveCity(updatedCity);
    } 
  });
}

/*FUNCTIONS FOR DELETING A CITY OBJECT */

function handleDeleteCityClicked(){//handles user clicks on the detail page for deleting a given city
  $('.city-detail-container').on('click', '.delete-city', function(event){
    event.preventDefault();
    let cityIndex = state.selectedCityIndex;
    let selectedCity = state.cities[cityIndex];
    let cityID = selectedCity.id;
    deleteCity(cityID);
  });
}

function deleteCity(id){//ajax request to delete the city with a given id
  $.ajax({
    type: 'DELETE',
    url: `/api/cities/${id}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${token}`
    },
  })
  .then(() => {
    getCities();
    $('.darken-detail').hide();
  })
  .fail((error) => {
    generateError(error);
  })
};

/*FUNCTIONS FOR CREATING A NEW CITY OBJECT*/

function getCheckboxValues(){//gets the values of whatever is checked among the tag checkboxes
  let checkedVals = [];
  $('input[type=checkbox]:checked').each(function(){
    checkedVals.push($(this).val());
  });
  return checkedVals;
}


function createCityObject(){//creates a new city object so that it can be used by the google maps functions and stored successfully via the storeCity function
  $('#add-city-form').on('submit', function(event){
    event.preventDefault();
    let cityName = $('#cityName').val();
    let country = $('#country').val();
    if(isNaN($('#yearVisited').val())){
      $('.error-message-add').html('Please insert a valid year.');
    }
    else{
      let yearVisited = $('#yearVisited').val();
      let notes = $('#notes').val();
      let tags = getCheckboxValues();
      let imageURL = $('#imageURL').val() || 'https://images.pexels.com/photos/161893/seattle-washington-city-cities-161893.jpeg';
      let newCity = {
        cityName:cityName,
        country:country,
        yearVisited:yearVisited,
        notes:notes,
        tags:tags,
        imageURL:imageURL,
        location:{}
      }
      findCityLocation(newCity);
    }
  });
}


/*FUNCTIONS RELATED TO ERROR HANDLING */

function generateError(error){//generates an error if necessary
  console.error(error)
}

/* FUNCTIONS RELATED TO LOGGING OUT */

function handleLogOutClicked(){//handles user click to logout
  $('.topnav').on('click','.logout-button', function(event){
    event.preventDefault();
    logoutUser();
  })
}

function logoutUser(){//makes the request to logout the user/delete relevant token and take them back to the landing/index page
  $.ajax({
    url: '/api/auth/logout',
    type:'GET',
    headers:{
      'Authorization':`Bearer ${token}`,
    },
  }).then (() => {
    localStorage.removeItem('Token');
    window.location.href = 'index.html';
  })
  .fail(error => {
    generateError(error);
  })
}

function init() {
  initMap();
  getCities();
  createCityObject();
  handleCityClicked();
  handleEditThisCityClicked();
  handleUpdateCityClicked();
  handleDeleteCityClicked();
  handleLogOutClicked();
  handleToggleClicked();
};
