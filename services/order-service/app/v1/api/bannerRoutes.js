var express = require('express');
var router = express.Router();
var grnController = require('../controller/bannerController');

router.use(function (req, res, next) {
    next();
});

router.post('/index', function (req, res) {
    grnController.index(req, res);
});

module.exports = router;