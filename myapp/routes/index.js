var express = require('express');
var router = express.Router();

var handlebars = require('handlebars');
handlebars.registerPartial('page-top', 'page-top');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Film Logger' });
});

router.get('/about', function(req, res, next) {
    res.render('about', {title: 'Film Logger' });
});

module.exports = router;
