/* INCLUDES */
var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');
var fs = require('fs');
var titleCase = require('title-case');

/* HELPER MODULE */
const filmLogger = require('../film_logger');

/* the /log path -- action for form submission */
router.get('/', function(req, res, next) {
    //Convert user text into title case
    const title = titleCase(req.query.title);
	console.log(title);
	
	//The form 'requires' the title, but error check anyway
	if (title)
	    filmLogger.logFilm(req, res, title);
	else
	{
	    req.app.locals.error = "No film entered. Try again.";
	    res.redirect('/');
	}
});

module.exports = router;