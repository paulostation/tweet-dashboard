var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var tweets = require("../tweets.json");
  res.render('tweets', { tweets: tweets });  
});

module.exports = router;