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
        lat: { mn: 25, mx: 40 },
        lng: { mn: -125, mx: -70 }
      },
      { // europe
        lat: { mn: 35, mx: 70 },
        lng: { mn: 10, mx: 30 }
      },
      { // taiwan& japan & korea
        lat: {mn: 22, mx: 45}, 
        lng: {mn: 120, mx: 145}
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
    // static latlng for testing canvas animation 
    elseWhere = new google.maps.LatLng(lat,lng);

    panoramaOptions = {
      draggableCursor : "url(http://s3.amazonaws.com/besport.com_images/status-pin.png), auto;",
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
        $('#map-canvas')[0],
        panoramaOptions);
        checkResults();
      } else {
        init(); // initing animation 
        //street view hit something
        /// changing mouse cursor options doesn't work
        myPano.setOptions({  });
        $('#map-canvas').eq(0).css({"cursor":"url('images/radish.png')"});
        myPano.setVisible(true);

        var data = myPano.getLocation();
        console.log(data);
        var landed = JSON.stringify(data);
        $.ajax({
          method: 'POST',
          url: '/stViewLocation',
          dataType: 'json',
          data:landed,
          contentType:"application/json; charset=utf-8"
        }).done (function(data){
          console.log(data);
        });
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
google.maps.event.addEventListener