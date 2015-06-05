var myPano;

function initialize() {
  //let's go anywhere else in the world 
  getIt(); 
}

function getIt(){

  var lat, lng, elseWhere, panoramaOptions;
  function setMapDetails() {
    var latLngRanges = [
      { // america
        lat: { mn: 25, mx: 55 },
        lng: { mn: -125, mx: -70 }
      },
      { // europe
        lat: { mn: 35, mx: 70 },
        lng: { mn: 10, mx: 30 }
      },
      { // japan & korea
        lat: {mn: 30, mx: 45}, 
        lng: {mn: 125, mx: 145}
      },
      { //taiwan
        lat:{ mn:22, mx:25.1}, 
        lng:{ mn:120, mx:122}
      }, 
      { // australia 
        lat: {mn: -35, mx: -15},
        lng: {mn: 120, mx: 155}
      }
    ]
    //var otherPlaces

  var range = latLngRanges[Math.floor(Math.random() * latLngRanges.length)]
    lat = Math.random() * (range.lat.mx - range.lat.mn) + range.lat.mn;
    lng = Math.random() * (range.lng.mx - range.lng.mn) + range.lng.mn;
    elseWhere = new google.maps.LatLng(lat, lng);

    panoramaOptions = {
      position: elseWhere,
      pov: {
        heading: 165,
        pitch: 0
      },
      zoom: 1,
      addressControlOptions: {
          position: google.maps.ControlPosition.BOTTOM_CENTER
      },
      linksControl: false,
      panControl: false,
      zoomControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL
      },
      enableCloseButton: false
    };
  }

  setMapDetails();

  myPano = new google.maps.StreetViewPanorama(
  document.getElementById('map-canvas'),
  panoramaOptions);

  checkResults();
  function checkResults() {
    if (myPano.getStatus()) {
      if (myPano.getStatus() === 'ZERO_RESULTS') {
        // try a different lat/lng
        setMapDetails();
        myPano = new google.maps.StreetViewPanorama(
        document.getElementById('map-canvas'),
        panoramaOptions);
        checkResults();
      } else {
        // you win, render it
        console.log(myPano.projection);
        myPano.setVisible(true);
      }
    } else {
      // keep waiting
      setTimeout(function(){
        checkResults();
      }, 1);
    }
  }
  
}

google.maps.event.addDomListener(window, 'load', initialize);