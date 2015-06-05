var map;
function initialize() {
  
  var mapOptions = {
    zoom: 15,
    center: new google.maps.LatLng(40, -100),
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    disableDefaultUI: true,
    // mapTypeControl: false,
    // zoomControl: false,
    // panControl: false,
    // scaleControl: false
  }
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);

