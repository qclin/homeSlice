var myPano, canvas, img, user_answer, info;


function initialize() {
  //let's go anywhere else in the world 
  getIt(); 
}

function loading(){
  // loading a distractor. . . not working 
//   $('#distractor').eq(0).show();
//   $.ajax({
//     method: 'GET',
//     dataType: 'json',
//     contentType:"application/json; charset=utf-8",
//     url: "http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=loading ",
//   }).done(function(response){
//     debugger;
//     $('#gif').html("src=" + response.data.image_url +"");
//   });
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
    elseWhere = new google.maps.LatLng(lat, lng);

    panoramaOptions = {
      draggableCursor : "url(http://localhost:1234/css/image/radish.png), auto;",
      position: elseWhere,
      pov: {
        heading: 90,
        pitch: 45
      },
      zoom: 1,
      addressControl:false,
      // addressControlOptions: {
      //     position: google.maps.ControlPosition.BOTTOM_CENTER
      // },
      linksControl: false,
      panControl: false,
      zoomControl:false,
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
        //street view hit something
        $('#comments').show();
        myPano.setVisible(true);
        $('#distractor').eq(0).hide();
        info = myPano.getLocation();
      }
    } else {
      // keep waiting
      setTimeout(function(){
        checkResults();
      }, 1);
    }
  }
}

function guess(ele){
   if(event.keyCode == 13) {
        user_answer = ele.value;
        ele.value = myPano.location.description;
        init();   

        setTimeout(function(){
          $('#comments').eq(0).hide();
        },1000);
        var answer = JSON.stringify({results:{answer: user_answer},info});
        debugger;
        $.ajax({
          method: 'POST',
          url: '/stViewLocation',
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