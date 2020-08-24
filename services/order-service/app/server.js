"use strict";

require('dotenv').config();
var chalk = require('chalk');
var figlet = require('figlet');


var bodyParser = require('body-parser');
var multer = require('multer');

var express = require('express');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var app = express();
//var config = require('./config/config')[env];
var methodOverride = require('method-override');

const upload = multer({});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(upload.fields([{name: 'img'}]));

require('./config/express')(app);

require('./config/api')(app);
require('./config/routes')(app);
require('./config/mysql');

// Starting the server
var port = process.env.PORT || 1010;
var server = app.listen(port);
console.log(chalk.blue.bold(figlet.textSync('Order Service')));
console.log(chalk.green.bold(`Server Started at port: ${port}`));
