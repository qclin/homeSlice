// grabbing the google canvas and drawing right on it
// to maintain ability to pan around in the environment
var stage, canvas, cursor; 

function init(){
  console.log("we're in");
  createjs.MotionGuidePlugin.install(createjs.Tween); 
  canvas = document.getElementsByTagName('canvas')[0];
  console.log(canvas)
  canvas.width = $(window).width();
  canvas.height = $(window).height();

  stage = new createjs.Stage(canvas);

  radish = new createjs.Bitmap('../css/images/radish.png'); 
  radish.scaleX = .5;
  radish.scaleY = .5;
  stage.addChild(radish);
  replaceCursor();
  //createjs.Ticker.addEventListener("tick", replaceCursor);
}

function replaceCursor(){

  radish.x = stage.mouseX - 80;
  radish.y = stage.mouseY - 125;
  stage.update(); 
}