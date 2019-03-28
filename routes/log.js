/************************************
 * Setup for log.js
 ************************************/
// INCLUDES
var express = require('express');
var router = express.Router();
const flash = require('connect-flash');

// HELPER MODULE
const auth = require('../controllers/auth');
const filmLogger = require('../controllers/film_logger');
router.use(flash());

/************************************
 * Routers for log.js
 ************************************/
// Log Film - Form to enter information
router.get('/', auth.required, function(req, res, next) {
	res.render('log', { flashMsg: req.flash("LogError") });
});

// Add new film to the database
router.post('/', auth.required, function(req, res, next) {
	//The form 'requires' the title, but error check anyway
	if(!req.body.title)
		return next(new Error('InvalidInputError'));
	
	//Log the film and redirect
	filmLogger.logFilm(req, res)
	.then(() => { res.redirect("/films"); })
	.catch((err) => { next(new Error(err.message)); });
});

/************************************
 * Error handler for log.js
 ************************************/
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