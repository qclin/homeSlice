// grabbing the google canvas and drawing right on it
// to maintain ability to pan around in the environment
var stage, canvas, cursor, loader, bunchOfEM, holder;
var radish, jaffar, trap, follower, counter;

function initializeAnimation(){
  createjs.MotionGuidePlugin.install(createjs.Tween);
  canvas = $('#st-animation-canvas')[0];
  canvas.width = $(window).width();
  canvas.height = $(window).height();
  // gmap cursor is active
  for(var i = 0; i< $('.gm-style').children().length; i++ ){
  $('.gm-style').children(i).children(i).css("cursor", "none");
  }

  w = canvas.width;
  h = canvas.height;
  counter = 0;
  stage = new createjs.Stage(canvas);
  holder = stage.addChild(new createjs.Container());

  manifest = [
    {id:"prince", src:"princeOfPersia.png"},
    {id: "puff", src:"puff.png"},
    {id: "jaffar", src: "jaffar.png"},
    {id: "trap", src: "trap_tone.png"}
  ];

  loader = new createjs.LoadQueue(false);
  loader.addEventListener("complete", handleImageLoad);
  loader.loadManifest(manifest, true, "../css/sprites/");

  setTimeout(genFollower, 3000);
  happening();
}

function happening(){
  document.getElementById('map-canvas').addEventListener("click", function(){
    counter ++;
    if (counter == 10){
      setTrap();
    }
  });
}

function genFollower(){
  radish = new createjs.Bitmap('../css/images/radish.png');
  stage.addChild(radish);
  radish.alpha = .5;
  createjs.Ticker.addEventListener("tick", follow);
}

function follow(e){
  if (jaffar.x < w/2){
    radish.x = jaffar.x + w/10;
    radish.y = jaffar.y + h/10;
  }else if(jaffar.x > w/2){
    radish.x = jaffar.x - w/10;
    radish.y = jaffar.y - h/10;
  }
}

function handleImageLoad(e){
    var jaffarData = {
    framerate:50,
    images:[loader.getResult("jaffar")],
    frames:{ count: 24, regX: 33, regY: 25, width:66, height: 50 },
    animations:{
      "wkRight":[0,6, "wkRight"],
      "wkLeft":[7,12, "wkLeft"],
      "wkUp": [ 13, 18, "wkUp"],
      "wkDown": [19,23, "wkDown"]
    }
  }
  var jaffarSheet = new createjs.SpriteSheet(jaffarData);

  jaffar = new createjs.Sprite(jaffarSheet,"wkRight");
  jaffar.gotoAndPlay("wkRight");
  jaffar.x = w/2; jaffar.y = h/2;

  stage.addChild(jaffar);
  createjs.Ticker.addEventListener("tick", replaceCursor);

  var trapData = {
    framerate: 10,
    images:[loader.getResult("trap")],
    frames:{ count:8, regX: 20, regY: 25, width: 40, height: 50},
    animations: {
      "static":[0,9, "static"],
    }
  }
  var trapSheet = new createjs.SpriteSheet(trapData);
  trap = new createjs.Sprite(trapSheet, "static");
  trap.gotoAndPlay("static");
}

function replaceCursor(){
  jaffar.scaleX = stage.mouseX/100;
  jaffar.scaleY = stage.mouseY/100;
  jaffar.x = stage.mouseX;
  jaffar.y = stage.mouseY;
  radish.scaleX = jaffar.scaleX;
  radish.scaleY = jaffar.scaleY;
  if (jaffar.x >= w/2 ){
    jaffar.gotoAndPlay("wkRight");
  }else if(jaffar.x <=  w/2 ){
    jaffar.gotoAndPlay("wkLeft");
  }else if(jaffar.y <= h/2){
    jaffar.gotoAndPlay("wkDown");
  }else if(jaffar.y >= h/2){
    jaffar.gotoAndPlay("wkUp");
  }

  stage.update();
}

function setTrap(){
  trap.x = Math.floor(Math.random()*w);
  trap.y = Math.floor(Math.random()* (h/2));
  trap.scaleX = 3; trap.scaleY = 1.5;
  stage.addChild(trap);
  createjs.Ticker.addEventListener("tick", checkIfFallen);
}

function checkIfFallen(){
  document.getElementById('map-canvas').addEventListener("click", function(e){
    if((trap.x - 5 < jaffar.x && jaffar.x < trap.x + 5) && (trap.y - 5< jaffar.y && jaffar.y < trap.y +5)){
      window.location.assign(location.origin + "/americaLat40");
    }
  });
}
