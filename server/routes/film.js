/************************************
 * Setup for film.js
 ************************************/
// INCLUDES
var express = require('express');
var router = express.Router();

// DATABASE MODEL
const Film = require('../models/filmModel');

// FLASH MESSAGES
const flash = require('connect-flash');
router.use(flash());

// CONTROLLERS
const auth = require('../controllers/auth');
const filmLogger = require('../controllers/film_logger');
const FilmService = filmLogger.FilmService;

/************************************
 * Routers for film.js
 ************************************/ 
// Film index (diary)
router.get('/', auth.required, (req, res, next) => {
	FilmService.list(req.session.user)
	.then((films) => {renderPage('diary', req, res, films, 'SearchError');})
	.catch((err) => {
		if(err)
			next(new Error('DBSearchFailed', err));
	});
});

// Page for individual film
router.get('/:film', auth.required, (req, res, next) => {
	FilmService.read(req.params.film)
	.then((film) => { renderPage('film', req, res, film, 'FilmError'); })
	.catch((err) => { next(new Error("FilmNoExist", err)); });
});

// Form to edit film info
router.get('/:film/edit', auth.required, (req, res, next) => {
	FilmService.read(req.params.film)
	.then((film) => { renderPage('update', req, res, film, 'EditError'); })
	.catch((err) => { next(new Error('EditPageError', err)); });
});

// Delete film
router.get('/:film/delete', auth.required, (req, res, next) => {
	FilmService.delete(req.params.film)
	.then((film) => { res.redirect('/films'); })
	.catch((err) => { next(new Error('DeletionError', err)); });
});

// Process edits and update database
router.post('/:film', auth.required, (req, res, next) => {
	FilmService.update(req.params.film, update(req))
	.then(() => { res.redirect('/films/' + req.params.film); })
	.catch((err) => { next(new Error('UpdateError', err)); });
});


/************************************
 * Helper functions for film.js
 ************************************/
/*
 *	renderPage()
 *	Purpose: Helper function to streamline page rendering
 *	  Input: page, the .hbs template to use for rendering
 *			 info, the information associated with a film/films
 *			 [err], optional; if included, the kind of flash message to display
 */
function renderPage(page, req, res, info, err)
{
	res.render(page, {
		film: info,
		flashMsg: (err ? req.flash(err) : null)
	});
}

/*
 *	update()
 *	Purpose: create an object to use when updating a database entry
 *	  Input: req, the form data to include in the update
 *	 Return: Object that mongoose can use to update the database
 */
function update (req)
{
	return {
		rating: req.body.rating
	};
}

/************************************
 * Error handler for film.js
 ************************************/
router.use((err, req, res, next) => {
	console.log("Error: " + err.message);
	console.log(err);
	if(err.message === 'FilmNoExist')
	{
		req.flash('SearchError', 'That film page does not exist!');
		res.redirect('/films');
	}
	else if(err.message === 'DBSearchFailed')
	{
		req.flash('SearchError', 'Mongoose had trouble searching for films!');
		res.redirect('/films');
	}
	else if(err.message === 'DeletionError')
	{
		req.flash('FilmError', 'There was a problem deleting this film. Try again.');
		res.redirect('/films' + req.params.film);
	}
	else if(err.message === 'EditPageError')
	{
		req.flash('EditError', 'There was a problem editing this film. Try again.');
		res.redirect('/films' + req.params.film + '/edit');
	}
	else if(err.message === 'UpdateError')
	{
		req.flash('EditError', 'There was a problem saving changes to the database.');
		res.redirect('/films' + req.params.film + '/edit');
	}
	else
	{
		next(err);
	}
});

module.exports = router;