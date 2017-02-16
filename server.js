var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
// var fs = require('fs');
var app = express();
var ejs = require("ejs");
app.set("view engine", "ejs");

var secrets = require("./secrets.json");
var pg = require('pg');
// const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/homeSlice';
var connectStr = "pg://"+secrets["username"]+ ":"+ secrets["password"]+"@localhost/"+secrets["database"];
var client = new pg.Client(connectStr);

client.connect(function(err) {
  if(err) { return console.error('could not connect to postgres', err); }
  client.query('SELECT NOW() AS "theTime"', function(err, result) {
    if(err) { return console.error('error running query', err); }
    console.log(result.rows[0].theTime);
  });
});

var apiKey = process.env.GOOGLE_MAP_API_KEY;

app.use(cors());
app.use(bodyParser.json({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.get('/', function(req, res){
  res.render('index.html');
});

app.get('/americaLat40', function(req,res){
  res.render('scenes/aerialView.ejs', {apiKey});
});

app.get('/theVoid', function(req, res){
  res.render('scenes/streetView.ejs', {apiKey});
});

app.get('/places', function(req,res){
  client.query('SELECT * FROM streetview', function(err, data){
    if (err){throw err; }
    res.render('places.ejs', {places: data.rows});
  });
});

app.get('/places/:id', function(req,res){
  var current = parseInt(req.params.id);
  var max = parseInt(req.query.max);
  var prev = (current === 1) ? max : (current - 1);
  var next = (current === max) ? 1 : (current + 1);
  client.query('SELECT * FROM streetview WHERE id =' + req.params.id, function(err, data){
    if(err){throw err; }
    res.render('onePlace.ejs', {
      place: data.rows[0],
      siblings: { prev, next},
      max, apiKey
    });
  });
});

app.post('/streetviewLocation', function(req,res){
  var payload = req.body.info;
  var parameters = [payload.shortDescription, payload.latLng.lat, payload.latLng.lng, payload.description, payload.pano, req.body.results.answer]
  client.query('INSERT INTO streetview(location, latLng, description, pano_id, guess) VALUES ($1, POINT($2, $3), $4, $5, $6) RETURNING id', parameters, function(err, result){ if(err){ console.log(err);}
      var id = result.rows[0].id;
      /// attempt for screenshotting, but gm cors
      // var base64DATA = req.body.img.replace(/^data:image\/png;base64,/, "");
      // var buff = new Buffer(base64DATA, 'base64');

      // fs.writeFile("public/screenshot/street"+id+".png", buff, function(err){
      //   console.log(err);
      // });

      client.query("SELECT * FROM streetview WHERE id = " + id, function(err, result) {
        if(err){ throw err; }
        console.log(result.rows);
        res.json(result.rows);
      });
    });
});


app.listen(1234, function(){
  console.log("let's go port 1234");
});
