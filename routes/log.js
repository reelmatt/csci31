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

router.get('/', auth.required, function(req, res, next) {
	res.render('log', { 
        user: req.session.user,
        error: req.flash("apiError")
    });
	
});

/* Log a new film */
router.post('/', auth.required, function(req, res, next) {
	//The form 'requires' the title, but error check anyway
	if(!req.body.title)
	{
		req.flash('inputError', "No film entered. Try again.");
	    res.redirect('/log');
	}
	
	//Log the film and redirect
	filmLogger.logFilm(req, res)
		.then(() => {res.redirect("/films");})
		.catch((err) => {console.log(err);});

});

/* ERROR HANDLER */
router.use((err, req, res, next) => {
	console.error(err.stack);
	if(err.message == "FileSaveError") {
		console.log("file save error");
	}
});

module.exports = router;