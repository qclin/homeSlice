var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');
var cors = require('cors');

var db = new sqlite3.Database("db/diner.db");
var app = express();

