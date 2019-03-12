/* INCLUDES */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { 
        title: 'Film Logger',
        error: req.app.locals.error
    });
    
    //Reset error message
    req.app.locals.error = undefined;
});

/* GET about page */
router.get('/about', function(req, res, next) {
    res.render('about', {
        title: req.app.locals.pageTitle
    });
});

module.exports = router;
