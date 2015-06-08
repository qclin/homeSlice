var express = require('express');
var bodyParser = require('body-parser');
// var pg = require('pg');
var cors = require('cors');
var fs = require('fs');
var app = express();
var ejs = require("ejs");
app.set("view engine", "ejs");

var secrets = require("./secrets.json");
var pg = require('pg'); 
var connectStr = "pg://"+secrets["username"]+ ":"+ secrets["password"]+"@localhost/homeslice"; 
var client = new pg.Client(connectStr); 
client.connect(function(){
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
  
  client.query('INSERT INTO stView(location, latLng, description, pano_id) VALUES ($1, POINT($2, $3), $4, $5) RETURNING id', [req.body.pano.shortDescription, req.body.pano.latLng.A, req.body.pano.latLng.F, req.body.pano.description, req.body.pano.pano], function(err, result){ if(err){ throw err; }

      var id = result.rows[0].id;
      console.log(req.body.img);
      var base64DATA = req.body.img.replace(/^data:image\/png;base64,/, "");
      var buff = new Buffer(base64DATA, 'base64');
      console.log(base64DATA);
      console.log(buff.length);
          fs.writeFile("public/screenshot/street"+id+".png", buff, function(err){
            console.log(err);
          });

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
