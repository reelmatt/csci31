/* INCLUDES */
var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');
var fs = require('fs');

const flash = require('connect-flash');
const auth = require('../controllers/auth');

/* HELPER MODULE */
const filmLogger = require('../controllers/film_logger');
router.use(flash());

/*
 *	the /log path -- action for form submission
 */
router.post('/', function(req, res, next) {
	//The form 'requires' the title, but error check anyway
	if (req.body.title)
	{
		filmLogger.logFilm(req, res)
		.then(() => {
	    	console.log("filmLogger succeeded, redirecting now...");
	    	res.redirect("/films");
		})
		.catch((err) => {
			console.log(err);
	    	console.log("in log.js, and there was error?");
		});
	}
	else
	{
	 	req.flash('inputError', "No film entered. Try again.");
	    res.redirect('/');
	}
});

/* ERROR HANDLER */
router.use((err, req, res, next) => {
	console.error(err.stack);
	if(err.message == "FileSaveError") {
		console.log("file save error");
	}
});

module.exports = router;