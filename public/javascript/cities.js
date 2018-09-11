'use strict';
/* global $ */

$(".close").click(function(e){
  $(".citiescontainer").hide();
})

$(".open").click(function(e){
  $(".citiescontainer").show();
})
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