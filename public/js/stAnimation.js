// grabbing the google canvas and drawing right on it
// to maintain ability to pan around in the environment
var stage, canvas, cursor, radish, bunchOfEM; 

function init(){
  console.log("we're in");
  createjs.MotionGuidePlugin.install(createjs.Tween); 
  bunchOfEM = document.getElementsByTagName('canvas');
  ///// this is to grab the google canvas 
  // for(var i=0; i< bunchOfEM.length; i ++){
  //   if (bunchOfEM[i].style.display != "none"){
  //     canvas = bunchOfEM[i];
  //   }
  // }
  canvas = $('#canvas')[0];

  // $('.gm-style').children(0).children(0).css("cursor", "url('http://localhost:1234/css/images/radish.png'), default");
  //canvas = document.getElementsByTagName('canvas')[0];

  canvas.width = $(window).width();
  canvas.height = $(window).height();

  stage = new createjs.Stage(canvas);

  radish = new createjs.Bitmap('../css/images/radish.png'); 
  radish.scaleX = .5;
  radish.scaleY = .5;
  radish.x = canvas.width/2;
  radish.y = canvas.height/2;
  stage.addChild(radish);
  createjs.Ticker.addEventListener("tick", replaceCursor);

  var circle = new createjs.Shape();
   circle.graphics.beginFill("DeepSkyBlue").drawCircle(0,0,50);
   circle.x = 100;
   circle.y = 100;
   stage.addChild(circle);
   createjs.Tween.get(circle, {loop:true})
   .to({ x: 400}, 5000, createjs.Ease.getPowInOut(5))
   .to({ alpha: 0, y: 175}, 500, createjs.Ease.getPowInOut(2))
   .to({ alpha: 0, y: 175}, 100)
   .to({ alpha: 1, y: 100 }, 500, createjs.Ease.getPowInOut(2))
   .to({ x: 100}, 800, createjs.Ease.getPowInOut(2));
   createjs.Ticker.setFPS(60);
   createjs.Ticker.addEventListener("tick", stage);

}

function replaceCursor(){

  radish.x = stage.mouseX - 80;
  radish.y = stage.mouseY - 125;
  stage.update(); 
}


