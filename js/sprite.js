var canvas, stage, w, h, loader;
var prince, puff, puff2, puff3, puff4, puff5;
var lfHeld, rtHeld, upHeld, dnHeld, drCir; 
var keyDn = false; 

var img = new Image();
img.crossOrigin="Anonymous";

function init(){
  //$('.circle').html = "";
  createjs.MotionGuidePlugin.install(createjs.Tween);

  canvas = $('#canvas')[0];
  stage = new createjs.Stage(canvas);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  w = canvas.width;
  h = canvas.height;

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

  puff2 = new createjs.Sprite(puffSheet, "wadlRt"); 
  puff2.gotoAndPlay("wadlRt");
  puff2.x = w-445;
  puff2.y = h-45;
  stage.addChild(puff2); 

  puff3 = new createjs.Sprite(puffSheet, "wadlRt"); 
  puff3.gotoAndPlay("wadlRt");
  puff3.x = w-345;
  puff3.y = h-45;
  stage.addChild(puff3); 

  puff4 = new createjs.Sprite(puffSheet, "wadlRt"); 
  puff4.gotoAndPlay("wadlRt");
  puff4.x = w-245;
  puff4.y = h-45;
  stage.addChild(puff4); 

  puff5 = new createjs.Sprite(puffSheet, "wadlRt"); 
  puff5.gotoAndPlay("wadlRt");
  puff5.x = w-145;
  puff5.y = h-45;
  stage.addChild(puff5); 

  var tween = createjs.Tween.get(puff).to({guide:{
    path: [0,90, w/2, h/2, w-45, h-45],
    orient: true }},8000, 
    createjs.Ease.bounceInOut);
  
////////////////////

// for (i=0;i<90;i++){
//   circle()
// }
      
  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.addEventListener("tick",tick);
}
function tick(e){

  if(lfHeld){
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
  if(drCir){
    var circle = new createjs.Shape();
      circle.graphics.setStrokeStyle(15);
      circle.graphics.beginStroke("#113355");
      circle.graphics.drawCircle(0, 0, (4 + 1) * 4);
      circle.x = prince.x;
      circle.y = prince.y;
      circle.compositeOperation = "lighter";
      ///// the idea of having the circles generate an html div for later consumption
      // $('<div class = "circle">').prependTo($('body'));
      // $('.circle').eq(-1).append(circle);
      // stage.addChild(circle);
  }

  // var deltaS = e.delta/ 1000; 
  // var position = puff.x + 150 * deltaS; 
  // var puffW = puff.getBounds().width * puff.scaleX; 
  // puff.x = (position >= stage.canvas.width+ puffW) ? - puffW : 
  // position; 

  stage.update(e);
}

$(function() {
  $('body').keydown(function(e){
      console.log(e.keyCode);
    if(!e){ var e = window.Event; }
    switch(e.keyCode){
      case 32: drCir = true; break; 
      case 37: lfHeld = true; break; 
      case 39: rtHeld = true; break; 
      case 38: upHeld = true; break; 
      case 40: dnHeld = true; break; 
    }

  });

  $('body').keyup(function(e){

    if(!e){ var e = window.Event; }
    switch(e.keyCode){
      case 32:keyDn = false; drCir = false; break; 
      case 37: prince.gotoAndStop('wkLeft');keyDn = false; lfHeld = false; break; 
      case 39: prince.gotoAndStop('wkRight');keyDn = false; rtHeld = false; break; 
      case 38: prince.gotoAndStop('wkUp');keyDn = false; upHeld = false; break; 
      case 40: prince.gotoAndStop('wkDown');keyDn = false; dnHeld = false; break; 
    }
  }); 
});



function circle(){
  var color = ["GoldenRod","DarkKhaki","Maroon","OliveDrab","OrangeRed","Yellow"]
  ranCol = color[Math.floor(Math.random()*color.length)]
  var orb = new createjs.Shape();
  orb.graphics.beginStroke(ranCol).drawCircle(0,0,Math.floor(Math.random()*45));
  orb.x = Math.floor(Math.random()*w);
  orb.y = Math.floor(Math.random()*h);
  orb.compositeOperation = "lighter";
  orb.alpha = .5;
  //scared(orb)
  stage.addChild(orb);
}

// function updateCanvasSize() {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
// }

