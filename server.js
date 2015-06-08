var express = require('express');
var bodyParser = require('body-parser');
// var pg = require('pg');
var cors = require('cors');

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

app.post('/stViewLocation', function(req,res){
  client.query('INSERT INTO stView(location, latLng, description, pano_id) VALUES ($1, POINT($2, $3), $4, $5) RETURNING id', [req.body.shortDescription, req.body.latLng.A, req.body.latLng.F, req.body.description, req.body.pano], function(err, data){ if(err){ throw err; }

    var id = data.rows[0].id;
        client.query("SELECT * FROM stView WHERE id = " + id, function(err, data) {
          if(err){ throw err; }
          console.log(data.rows)
          res.json(data.rows);
        });
    });
});


app.listen(1234, function(){
  console.log("let's go ");
});
