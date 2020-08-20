var express = require('express');
var router = express.Router();
var contentController = require('../controller/contentController');

router.use(function (req, res, next) {
    next();
});

router.post('/index', function (req, res) {
    contentController.index(req, res);
});

module.exports = router;