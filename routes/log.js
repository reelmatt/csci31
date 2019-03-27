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
        flashMsg: req.flash("LogError")
    });
	
});

/* Log a new film */
router.post('/', auth.required, function(req, res, next) {
	
	//The form 'requires' the title, but error check anyway
	if(!req.body.title)
	{
		console.log("No title entered");
		return next(new Error('InvalidInputError'));
	}
	
	//Log the film and redirect
	filmLogger.logFilm(req, res)
		.then(() => {res.redirect("/films");})
		.catch((err) => {
			console.log("in log.js, filmLogger error");
			console.log(err.message);
			next(new Error(err.message));
		});

});

/* ERROR HANDLER */
router.use((err, req, res, next) => {
	console.log("Error: " + err.message);
	if(err.message === 'InvalidInputError')
	{
		req.flash('LogError', 'A film title is required. Try again.');
		res.redirect('/log');
	}
	else if(err.message === "ApiError")
	{
		req.flash('LogError', err);
		res.redirect('/log');
	}
	else if(err.message === "FilmSaveError")
	{
		req.flash('LogError', 'There was a problem saving this film to the database. Try again.');
		res.redirect('/log');
	}
	else if(err.message === "MovieNotFound")
	{
		req.flash('LogError', 'OMDB could not find the movie you searched for. Try a different film.');
		res.redirect('/log');
	}
	else
	{
		next(err);
	}
});

module.exports = router;