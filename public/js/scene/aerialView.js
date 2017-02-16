var map, lng, latLng;
function initialize() {
  lng = -100
  latLng = new google.maps.LatLng(40,lng);
  var mapOptions = {
    zoom: 15,
    center: latLng,
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    disableDefaultUI: true
  }
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  canvas = $('#map-canvas')[0];
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

google.maps.event.addDomListener(window, 'load', initialize);

function goEast(){
  for(i=0; i<1; i+= 0.1){
    lng += i;
  }
  map.panBy(-canvas.width/2, 0);
}

function goWest(){
  for(i=0; i<1; i+= 0.1){
    lng -= i;
  }
  map.panBy(canvas.width/2, 0);
}
