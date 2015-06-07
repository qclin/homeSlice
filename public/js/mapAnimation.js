var canvas, stage, w, h, loader;
var jaffar, puff, puff2, puff3, puff4, puff5;
var lfHeld, rtHeld, upHeld, dnHeld, sendFire; 
var puffins, puffSheet, characters; 
var radars, trap;
var tweens, activeCount;
var flareCount = 10;
var keyDn = false; 

function init(){
  createjs.MotionGuidePlugin.install(createjs.Tween);
  canvas = $('#canvas')[0];
  stage = new createjs.Stage(canvas);

  canvas.width = $(window).width();
  canvas.height = $(window).height();
  w = canvas.width;
  h = canvas.height;
  tweens = [];

  manifest = [
    {id:"prince", src:"princeOfPersia.png"},
    {id: "puff", src:"puff.png"}, 
    {id: "jaffar", src: "jaffar.png"}, 
    {id: "trap", src: "trap_tone.png"}
  ];

  loader = new createjs.LoadQueue(false);
  loader.addEventListener("complete", handleImageLoad);
  loader.loadManifest(manifest, true, "../css/sprites/");
}

function handleImageLoad(e){
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
  trap.x = w/7; trap.y = 4*h/5;
  trap.scaleX = 1.5; trap.scaleY = 1; 
  stage.addChild(trap);
  
  var jaffarData = {
    framerate:10, 
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
  //new createjs.SpriteSheetUtils.addFlippedFrames(spriteSheet, {wkLeft:["wkRight", true, false, "wkLeft"]});
  jaffar.gotoAndStop("wkRight");

  jaffar.x = w/2; jaffar.y = h/2; 

  stage.addChild(jaffar); 

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

  puffins = stage.addChild(new createjs.Container());

  puffSheet = new createjs.SpriteSheet(puffData);
  flypuff = new createjs.Sprite(puffSheet, "wadlRt"); 
  flypuff.gotoAndPlay("wadlLf");
  flypuff.y = canvas.width/5;

  puffins.addChild(flypuff); 

  for(i = 0; i< 6; i++){
    puff = new createjs.Sprite(puffSheet, "wadlRt"); 
    puff.gotoAndPlay("wadlRt");
    puff.x = w-45;
    puff.y = h-(45+(i*100));
    puffins.addChild(puff); 
  }
  var tween = createjs.Tween.get(flypuff).to({guide:{
    path: [0,90, w/2, h/2, w-45, h-45],
    orient: true }},8000, 
    createjs.Ease.bounceInOut);
  

  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.addEventListener("tick",tick);
}
function tick(e){

  if(lfHeld){jaffar.x -= 5; }
  if(rtHeld){jaffar.x += 5; }
  if(dnHeld){jaffar.y += 5; }
  if(upHeld){jaffar.y -= 5; }
  if(lfHeld && keyDn == false){ 
    jaffar.gotoAndPlay("wkLeft"); keyDn = true;}
  if(rtHeld && keyDn == false){ 
    jaffar.gotoAndPlay("wkRight"); keyDn = true; }
  if(dnHeld && keyDn == false){
    jaffar.gotoAndPlay("wkDown"); keyDn = true; }
  if(upHeld && keyDn == false){ 
    jaffar.gotoAndPlay("wkUp"); keyDn = true; }
  if(sendFire){
    liteIt();
  }
  if(sendFire && keyDn == false){

  }
  if((trap.x - 5 < jaffar.x && jaffar.x < trap.x + 5) && (trap.y - 5< jaffar.y && jaffar.y < trap.y +5)){
    window.location.assign("http://localhost:1234/theVoid");
  }
  if(jaffar.x == 0){
    goEast();
    jaffar.x = w/2;
  }else if(jaffar.x == w){
    goWest();
    jaffar.x = w/2;
  }

  trap.on("click", function(e){
    window.location.assign("http://localhost:1234/theVoid");
  });
  // var deltaS = e.delta/ 1000; 
  // var position = puff.x + 150 * deltaS; 
  // var puffW = puff.getBounds().width * puff.scaleX; 
  // puff.x = (position >= stage.canvas.width+ puffW) ? - puffW : 
  // position; 

  stage.update(e);
}

$(function() {
  $('body').keydown(function(e){
    if(!e){ var e = window.Event; }
    switch(e.keyCode){
      case 32: sendFire = true; break; 
      case 37: lfHeld = true; break; 
      case 39: rtHeld = true; break; 
      case 38: upHeld = true; break; 
      case 40: dnHeld = true; break; 
    }
  });

  $('body').keyup(function(e){
    if(!e){ var e = window.Event; }
    switch(e.keyCode){
      case 32:keyDn = false; sendFire = false; break; 
      case 37: jaffar.gotoAndStop('wkLeft');keyDn = false; lfHeld = false; break; 
      case 39: jaffar.gotoAndStop('wkRight');keyDn = false; rtHeld = false; break; 
      case 38: jaffar.gotoAndStop('wkUp');keyDn = false; upHeld = false; break; 
      case 40: jaffar.gotoAndStop('wkDown');keyDn = false; dnHeld = false; break; 
    }
  }); 
  
});

function liteIt(){
  radars = stage.addChild(new createjs.Container());
  
  for (i = 0; i< flareCount; i++){
    var fire = new createjs.Shape();
    fire.graphics.setStrokeStyle(15);
    fire.graphics.beginStroke("#9c2a00");
    fire.graphics.drawCircle(0, 0, (flareCount - 1));
    fire.alpha = 1 - i * 0.02;
    fire.compositeOperation = "lighter";
    fire.x = jaffar.x; 
    fire.y = jaffar.y;

    var tween = createjs.Tween.get(fire).to({x: w, y: jaffar.y}, (0.5 + i * 0.04) * 1500, createjs.Ease.bounceOut).call(simmerDown);
    tweens.push({tween: tween, flare: fire});
    radars.addChild(fire);
    activeCount = flareCount; 
  }

  //now lets hit the puffins
  var amt = puffins.getNumChildren();
  for(i = 0; i< amt; i++){
    var onePuff = puffins.getChildAt(i);
    var pt = onePuff.globalToLocal(radars.getChildAt(9).x, radars.getChildAt(9).y); 
    if(onePuff.hitTest(pt.x, pt.y)){  
      alert("hit"); puffins.removeChild(onePuff);
    }
    radars.removeAllChildren;
  }
}


function simmerDown(){
  activeCount --;
  radars.removeAllChildren;
}




