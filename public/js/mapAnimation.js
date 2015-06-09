var canvas, stage, w, h, loader;
var jaffar, puff, puff2, puff3, puff4, puff5;
var lfHeld, rtHeld, upHeld, dnHeld, sendFire; 
var puffins, puffSheet, onePuff, characters; 
var radars, trap;
var tweens, activeCount;
var flareCount = 5;
var keyDn = false; 
var counter; 

function init(){
  createjs.MotionGuidePlugin.install(createjs.Tween);
  canvas = $('#canvas')[0];
  stage = new createjs.Stage(canvas);

  canvas.width = $(window).width();
  canvas.height = $(window).height();
  w = canvas.width;
  h = canvas.height;
  tweens = [];
  counter = 0;

  manifest = [
    {id:"prince", src:"princeOfPersia.png"},
    {id: "puff", src:"puff.png"}, 
    {id: "jaffar", src: "jaffar.png"}, 
    {id: "trap", src: "trap_tone.png"}
  ];

  loader = new createjs.LoadQueue(false);
  loader.addEventListener("complete", handleImageLoad);
  loader.loadManifest(manifest, true, "../css/sprites/");
  setTimeout(renderTrap, 30000);

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
  makePuff();
  flyingPuff();

  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.addEventListener("tick",tick);
  createjs.Ticker.addEventListener("tick",roamPuff);

}
function tick(e){
  if(jaffar.y > h) {jaffar.y = 0;}
  if(jaffar.y < 0) {jaffar.y = h;}
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
    simmerDown();
  }
  if((trap.x - 5 < jaffar.x && jaffar.x < trap.x + 5) && (trap.y - 5< jaffar.y && jaffar.y < trap.y +5)){
    window.location.assign(location.origin + "/theVoid");
  }
  if(jaffar.x <= 0){
    goEast();
    jaffar.x = w/2;
  }else if(jaffar.x >= w){
    goWest();
    jaffar.x = w/2;
  }

  trap.on("click", function(e){
    window.location.assign(location.origin + "/theVoid");
  });

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
      case 32: jaffar.gotoAndStop('wkRight'); keyDn = false; sendFire = false; break; 
      case 37: jaffar.gotoAndStop('wkLeft');keyDn = false; lfHeld = false; break; 
      case 39: jaffar.gotoAndStop('wkRight');keyDn = false; rtHeld = false; break; 
      case 38: jaffar.gotoAndStop('wkUp');keyDn = false; upHeld = false; break; 
      case 40: jaffar.gotoAndStop('wkDown');keyDn = false; dnHeld = false; break; 
    }
  }); 
  
});

function renderTrap(){
  trap.x = Math.floor(Math.random()*w); trap.y = Math.floor(Math.random()* h);
  trap.scaleX = 1.5; trap.scaleY = 1; 
  stage.addChild(trap);
}
function makePuff(){
  for(i = 0; i< 5; i++){
    puff = new createjs.Sprite(puffSheet, "wadlRt"); 
    puff.gotoAndPlay("wadlRt");
    puff.x = w-45;
    puff.y = h-(i*100)-100;
    puffins.addChild(puff);
  }
}

function flyingPuff(){
  flypuff = new createjs.Sprite(puffSheet, "wadlRt"); 
  flypuff.gotoAndPlay("wadlLf");
  flypuff.y = canvas.width/5;

  puffins.addChild(flypuff); 

  var tween = createjs.Tween.get(flypuff).to({guide:{
    path: [0,90, w/2, h/2, w-45, h-45],
    orient: true }},8000, 
    createjs.Ease.bounceInOut);
}

function roamPuff(e){
  var amt = puffins.getNumChildren();
  for(i = 0; i< amt; i++){
    onePuff = puffins.getChildAt(i);
    var deltaS = e.delta/ 3000; 
    var position = onePuff.x + 150 * deltaS; 
    var puffW = onePuff.getBounds().width * onePuff.scaleX; 
    onePuff.x = (position >= stage.canvas.width+ puffW) ? + puffW : position; 

  }
}

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
  }
}


function simmerDown(){
  //now lets hit the puffins
  var amt = puffins.getNumChildren();
  for(i = 0; i< amt; i++){
    onePuff = puffins.getChildAt(i);
    checkHit();
    if((onePuff.x + 2 >= jaffar.x && onePuff.x -2 <= jaffar.x)&&(onePuff.y+2 >= jaffar.y && onePuff.y-2 <= jaffar.y-2)){
      alert("get out the way ~!");
    }
  }
}

function checkHit(){
  if(((tweens[10].tween._actions[0].p[0]._initQueueProps.x < onePuff.x) && (onePuff.x < tweens[10].tween._actions[0].p[0]._curQueueProps.x)) &&((onePuff.y > jaffar.y -2) && (onePuff.y < jaffar.y + 2)) ){  
  puffins.removeChild(onePuff);

    tweens =[];
    counter += 1; 
  }
  if(puffins.getNumChildren() == 1){
    makePuff();
  }
}



