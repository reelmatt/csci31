/************************************
 * Setup for api-film.js
 ************************************/
// INCLUDES
var express = require('express');
var router = express.Router();
const filmLogger = require('../../controllers/film_logger');
const FilmService = filmLogger.FilmService;

// DATABASE MODEL
const Film = require('../../models/filmModel');

// FLASH MESSAGES
const flash = require('connect-flash');
router.use(flash());

// CONTROLLERS
const auth = require('../../controllers/auth');

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

router.use((req, res, next) => {
	res.set({
		// Allow AJAX access from any domain
		'Access-Control-Allow-Origin':'*',

		// Allow methods and headers for 'preflight'
		'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers',
	});

	if(req.method == 'OPTIONS')
		return res.status(200).end();

	next();
});

//list
router.get('/', (req, res, next) => {
	FilmService.list(req.session.user)
	.then((films) => {
		res.status(200);
		res.json(films);
	})
	.catch((err) => {
		res.status(404).end();
	});
});

//read
router.get('/:film', (req, res, next) => {
	FilmService.read(req.params.film)
	.then((film) => {
		res.status(200);
		res.json(film);
	})
	.catch((err) => {
		res.status(404).end();
	});
});

//create
router.post('/', (req, res, next) => {
	FilmService.create(req)
	.then((addedFilm) => {
		res.status(201);
		res.json(addedFilm);
	})
	.catch((err) => {
		res.status(404).end();
	});
});

//update
router.put('/:film', (req, res, next) => {
	FilmService.update(req.params.film, update(req))
	.then((updatedFilm) => {
		res.status(200);
		res.json(updatedFilm);
	})
	.catch((err) => {
		res.status(404).end();
	});
});

//delete
router.delete('/:film', (req, res, next) => {
	FilmService.delete(req.params.film)
	.then((film) => {
		res.status(200);
		res.json(film);
	})
	.catch((err) => {
		res.status(404).end();
	});
});

module.exports = router;