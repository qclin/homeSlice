var myPano, canvas, user_answer, panoramaLocation;


function initialize() {
  // grabs arial view of america landscape
  requestStreetView();
}

function getLatLngPostion() {
const latLngRanges = [
    { // america
      lat: { min: 25, max: 40 },
      lng: { min: -125, max: -70 }
    },
    { // europe
      lat: { min: 35, max: 70 },
      lng: { min: 10, max: 30 }
    },
    { // taiwan& japan & korea
      lat: {min: 22, max: 45},
      lng: {min: 120, max: 145}
    },
    { // australia
      lat: {min: -35, max: -15},
      lng: {min: 120, max: 155}
    }
  ]
  const range = latLngRanges[Math.floor(Math.random() * latLngRanges.length)];
  const lattidue = Math.random() * (range.lat.max - range.lat.min) + range.lat.min;
  const longitude = Math.random() * (range.lng.max - range.lng.min) + range.lng.min;
  // static latlng for testing canvas animation
  return new google.maps.LatLng(lattidue, longitude).toJSON();
}


var panoramaOptions = {
  draggableCursor : "url("+location.origin+"/css/image/radish.png), auto;",
  zoom: 1,
  addressControl:false,
  addressControlOptions: {
      position: google.maps.ControlPosition.BOTTOM_CENTER
  },
  linksControl: false,
  panControl: false,
  zoomControl:false,
  zoomControlOptions: {
      style: google.maps.ZoomControlStyle.SMALL
  },
  enableCloseButton: false
};


var panorama;
var position;
var sv = new google.maps.StreetViewService();

function requestStreetView(){
  position = getLatLngPostion();
  sv.getPanorama({ location: position, radius: 50}, processSVData);
}

function processSVData(data, status) {
  if (status === 'OK'){
    panorama = new google.maps.StreetViewPanorama(document.getElementById('map-canvas'), panoramaOptions);
    panorama.setPano(data.location.pano);
    panorama.setPov({
      heading: 90,
      pitch: 45
    });
    // remove cats
    $('#distractor').eq(0).fadeOut('200');
    // remove failed coordinates
    $('.notFoundLatLng').fadeOut('200');
    // show input field
    $('#comments').eq(0).fadeIn('200');
    panorama.setVisible(true);
    panoramaLocation = data.location;

  } else {
    $(`<h2 class="notFoundLatLng"> Lat: ${position.lat} Lng: ${position.lng} </h2>`).prependTo($('body'));
    requestStreetView()
  }
}

function guess(event){
   if(event.keyCode == 13) {

        user_answer = $('#comments').val();
        $('#comments').val(panoramaLocation.description).fadeOut('1000');;
        initializeAnimation();
        // $('#comments').eq(0)

        var answer = JSON.stringify({results:{answer: user_answer}, info: panoramaLocation});
        $.ajax({
          method: 'POST',
          url: location.origin+'/streetviewLocation',
          dataType: 'json',
          data: answer,
          contentType:"application/json; charset=utf-8"
        }).done (function(data){
          console.log("we posted: "+ data);
        });
    }
}

google.maps.event.addDomListener(window, 'load', initialize);
google.maps.event.addEventListener
