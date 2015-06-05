var myPano;

function initialize() {
  //let's go anywhere else in the world 
  getIt(); 

}

function getIt(){
  var lat = Math.floor(Math.random()*180)-90
  var lng = Math.floor(Math.random()*360)-180

  var elseWhere = new google.maps.LatLng(lat, lng);
  //37.869260, -122.254811
  var panoramaOptions = {
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

  myPano = new google.maps.StreetViewPanorama(
      document.getElementById('map-canvas'),
      panoramaOptions);

  console.log(lat);
  console.log(lng);
   
  // console.log(myPano.data.projection);
  addGMapListeners();
}

google.maps.event.addDomListener(window, 'load', initialize);

function addGMapListeners() {

  debugger;
google.maps.event.addListener(myPano, 'pano_changed', function() {
      // var panoCell = document.getElementById('map-canvas');
      console.log(myPano.projection);
      if (myPano.projection != undefined ){
        
        myPano.setVisible(true);
      }else{
        debugger;
        console.log(myPano.projection);
        getIt();
      }
  });
myPano.setVisible(false);
}