var path        = require('path');
var logger      = require('morgan');
var bodyParser  = require('body-parser');
var cors        = require('cors');
var jwt         = require('jwt-simple');

module.exports = function (app, config) {
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());
}