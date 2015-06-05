var express = require('express');
// var bodyParser = require('body-parser');
// var pg = require('pg');
var cors = require('cors');

var app = express();
var ejs = require("ejs")
app.set("view engine", "ejs")

app.use(cors());
app.use(express.static(__dirname + "/public"));


app.get('/', function(req, res){
  res.render('index.html')
});

app.get('/theVoid', function(req, res){
  console.log("we're in the back");
  res.render('stView.ejs')
});

app.listen(1234, function(){
  console.log("let's go ");
});
