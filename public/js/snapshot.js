// Prefer camera resolution nearest to 1280x720.
var constraints = { audio: true, video: { width: 1280, height: 720 } };
var video = document.querySelector('video');
var localstream;

navigator.mediaDevices.getUserMedia(constraints)
.then(function(mediaStream) {
  localstream = mediaStream;
  video.srcObject = mediaStream;
  video.onloadedmetadata = function(e) {
    video.play();
  };
})
.catch(function(err) { console.log(err.name + ": " + err.message); }); // always check for errors at the end.


$('#takePhotoBtn').click(function(){
  takeSnapshot()
});

function takeSnapshot() {
    var video = document.querySelector('video')
    var img = document.querySelector('img') || document.createElement('img');
    var context;
    var width = video.offsetWidth
      , height = video.offsetHeight;

    canvas = canvas || document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, width, height);

    img.src = canvas.toDataURL('image/png');
    document.body.appendChild(img);
    videoOff()
  }


  function videoOff() {
    video.pause();
    video.srcObject = null;
    localstream.getTracks()[0].stop();
    localstream.stop()
  }
