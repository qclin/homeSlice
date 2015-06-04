var canvas, stage, prince, puff, w, h, loader;
var lfHeld, rtHeld, upHeld, dnHeld; 
var keyDn = false; 

var img = new Image();
img.crossOrigin="Anonymous";

function init(){
  canvas = $('#canvas')[0];
  stage = new createjs.Stage(canvas);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  manifest = [
    {id:"prince", src:"princeOfPersia.png"},
    {id: "puff", src:"puff.png"}
  ];

  loader = new createjs.LoadQueue(false);
  loader.addEventListener("complete", handleImageLoad);
  loader.loadManifest(manifest, true, "../css/sprites/");
  }

function handleImageLoad(e){
  var princeData = {
    framerate:10, 
    images:[loader.getResult("prince")],
    frames:{
      count: 138, 
      regX: 25, regY: 17.5, 
      height: 45, width:35
    },
    animations:{
      "wkRight":[0,10, "wkRight"],
      "wkLeft":[11,18, "wkLeft"],
      "wkUp": [ 19, 23, "wkUp"], 
      "wkDown": [23,19, "wkDown"],

      "pause": [7]
    }
  }

  var princeSheet = new createjs.SpriteSheet(princeData); 

  prince = new createjs.Sprite(princeSheet,"wkRight");
  //new createjs.SpriteSheetUtils.addFlippedFrames(spriteSheet, {wkLeft:["wkRight", true, false, "wkLeft"]});
  prince.gotoAndStop("wkRight");

  prince.x = canvas.width/2; 
  prince.y = canvas.height/2; 
  stage.addChild(prince); 

////////// these are for Puff
  var puffData = {
    framerate:10,
    images:[loader.getResult("puff")],
    frames:{
      count: 32, 
      regX: 22.5, regY: 22.5, 
      height: 45, width: 45, 
    },
    animations: {
      "wadlRt" : [1, 4, "wadlRt"],
      "wadlLf" : [5, 8, "wadlLf"]
    }
  }
  var puffSheet = new createjs.SpriteSheet(puffData);
  puff = new createjs.Sprite(puffSheet, "wadlRt"); 
  puff.gotoAndPlay("wadlLf");
  puff.y = canvas.width/5;
  stage.addChild(puff); 
////////////////////

  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.addEventListener("tick",tick);
}
function tick(e){

  if(lfHeld){
    console.log("left key down")
    prince.x -= 5; 
  }
  if(rtHeld){
    prince.x += 5; 
  }
  if(dnHeld){
    prince.y += 5; 
  }
  if(upHeld){
    prince.y -= 5; 
  }
  if(lfHeld && keyDn == false){
    prince.gotoAndPlay("wkLeft");
    keyDn = true; 
  }
  if(rtHeld && keyDn == false){
    prince.gotoAndPlay("wkRight");
    keyDn = true; 
  }
  if(dnHeld && keyDn == false){
    prince.gotoAndPlay("wkDown");
    keyDn = true; 
  }
  if(upHeld && keyDn == false){
    prince.gotoAndPlay("wkUp");
    keyDn = true; 
  }

  var deltaS = e.delta/ 1000; 
  var position = puff.x + 150 * deltaS; 
  var puffW = puff.getBounds().width * puff.scaleX; 
  puff.x = (position >= stage.canvas.width+ puffW) ? - puffW : 
  position; 

  stage.update(e);
}

$(function() {
  $('body').keydown(function(e){
      console.log('key down');
    if(!e){ var e = window.Event; }
    switch(e.keyCode){
      case 37: lfHeld = true; break; 
      case 39: rtHeld = true; break; 
      case 38: upHeld = true; break; 
      case 40: dnHeld = true; break; 
    }
    console.log(e.keyCode);
  });

  $('body').keyup(function(e){

    if(!e){ var e = window.Event; }
    switch(e.keyCode){
      case 37: prince.gotoAndStop('wkLeft');keyDn = false; lfHeld = false; break; 
      case 39: prince.gotoAndStop('wkRight');keyDn = false; rtHeld = false; break; 
      case 38: prince.gotoAndStop('wkUp');keyDn = false; upHeld = false; break; 
      case 40: prince.gotoAndStop('wkDown');keyDn = false; dnHeld = false; break; 
    }
  }); 
});


function updateCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

