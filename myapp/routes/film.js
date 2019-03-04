var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('film', {title: req.query.title, rating: req.query.rating});
//  res.end('film', { title: req.query.title });
});

module.exports = router;