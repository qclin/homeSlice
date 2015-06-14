var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
// var fs = require('fs');
var app = express();
var ejs = require("ejs");
app.set("view engine", "ejs");

var secrets = require("./secrets.json");
var pg = require('pg'); 
/// local connection string
var connectStr = "pg://"+secrets["username"]+ ":"+ secrets["password"]+"@localhost/"+secrets["database"]; 
var client = new pg.Client(connectStr); 

client.connect(function(err) {
  if(err) { return console.error('could not connect to postgres', err); }
  client.query('SELECT NOW() AS "theTime"', function(err, result) {
    if(err) { return console.error('error running query', err); }
    console.log(result.rows[0].theTime);
    //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
  });
});

app.use(cors());
app.use(bodyParser.json({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.get('/', function(req, res){
  res.render('index.html');
});

app.get('/americaLat40', function(req,res){
  res.render('map.ejs');
});

app.get('/theVoid', function(req, res){
  res.render('stPano.ejs');
});

app.get('/allPlaces', function(req,res){
  client.query('SELECT * FROM stView', function(err, data){
    if (err){throw err; }
    res.render('places.ejs', {places: data.rows});
  });
});

app.get('/places/:id', function(req,res){
  client.query('SELECT * FROM stView WHERE id =' + req.params.id, function(err, data){
    if(err){throw err; }
    res.render('onePlace.ejs', {place: data.rows[0]});
  });
});

app.post('/stViewLocation', function(req,res){
  console.log(req.body);
  client.query('INSERT INTO stView(location, latLng, description, pano_id, guess) VALUES ($1, POINT($2, $3), $4, $5, $6) RETURNING id', [req.body.info.shortDescription, req.body.info.latLng.A, req.body.info.latLng.F, req.body.info.description, req.body.info.pano, req.body.results.answer], function(err, result){ if(err){ console.log(err);}
      console.log("posted on serverside");
      var id = result.rows[0].id;
      /// attempt for screenshotting, but gm cors 
      // var base64DATA = req.body.img.replace(/^data:image\/png;base64,/, "");
      // var buff = new Buffer(base64DATA, 'base64');

      // fs.writeFile("public/screenshot/street"+id+".png", buff, function(err){
      //   console.log(err);
      // });

      client.query("SELECT * FROM stView WHERE id = " + id, function(err, result) {
        if(err){ throw err; }
        console.log(result.rows);
        res.json(result.rows);
      });
    });
});


app.listen(1234, function(){
  console.log("let's go ");
});
