'use strict';
/* global $ */

/*FOR HIDING AND SHOWING THE CITIES BESIDE THE MAP */
$(".close").click(function(e){
  $(".citiescontainer").hide();
})

$(".open").click(function(e){
  $(".citiescontainer").show();
})

/*FOR INITIALIZING GOOGLE MAPS */
let map;
function initMap(data) {
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
}


/* FOR OPENING AND CLOSING CITY DETAIL PAGES */
$(".x").click(function(e){
  $(".darken").hide();
})

$(".opencity").click(function(e){
  $(".darken").show();
})