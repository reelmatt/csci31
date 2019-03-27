/* INCLUDES */
var express = require('express');
var router = express.Router();
//const app = express();
var http = require('http');
var request = require('request');
var fs = require('fs');

/* DATABASE MODEL */
const Film = require('../models/filmModel');

/* FLASH MESSAGES */
const flash = require('connect-flash');
router.use(flash());

/* CONTROLLERS */
const auth = require('../controllers/auth');
const omdb = require('../controllers/omdb');
const filmController = require('../controllers/film');

/* Film index */
router.get('/', auth.required, (req, res, next) => {

	Film.find({user: req.session.user})
	.then((films) => {
		res.render('diary', {
			user: req.session.user,
			films: films,
			userfilms: films,
			flashMsg: req.flash('PageError')
		});
	})
	.catch((err) => {
		if(err)
			next(new Error('DBSearchFailed', err));
	});
});

/* Show film info */
router.get('/:film', auth.required, (req, res, next) => {
	Film.findById(req.params.film)
	.then((film) => {
		res.render('film', {
			user: req.session.user,
			info: film
		});
	})
	.catch((err) => { next(new Error("FilmNoExist", err)); });
});


/* Edit film */
router.get('/:film/edit', auth.required, (req, res, next) => {
	Film.findById(req.params.film)
	.then((film) => {
		res.render('updateFilm', {
			user: req.session.user,
			film: film
		});
	})
	.catch((err) => { next(new Error('EditPageError', err)); });
});

/* Delete film */
router.get('/:film/delete', auth.required, (req, res, next) => {
	Film.deleteOne({_id: req.params.film})
	.then((film) => { res.redirect('/films'); })					//successfully deleted film
	.catch((err) => { next(new Error('DeletionError', err)); });	//problem with deletion
});


/* Save changes to film */
router.post('/:film', auth.required, (req, res, next) => {
	Film.findById(req.params.film)
	.then((film) => {
		var data = {
			rating: req.body.rating
		}
		
		film.set(data);
		
		film.save()
		.then(() => {res.redirect('/films/' + req.params.film); })
		.catch((err) => { next(new Error('UpdateError', err)); });

	})
	.catch((err) => { next(new Error('EditPageError', err)); });
});

/* ERROR HANDLER */
router.use((err, req, res, next) => {
	console.log("Error: " + err.message);
	if(err.message === 'FilmNoExist')
	{
		req.flash('PageError', 'That film page does not exist!');
		res.redirect('/films');
	}
	else if(err.message === 'EditPageError')
	{
		req.flash('PageError', 'There was a problem editing this film. Try again.');
		res.redirect('/films' + req.params.film);
	}
	else if(err.message === 'DBSearchFailed')
	{
		req.flash('PageError', 'Mongoose had trouble searching for films!');
		res.redirect('/films');
	}
	else if(err.message === 'DeletionError')
	{
		req.flash('PageError', 'There was a problem deleting this film. Try again.');
		res.redirect('/films' + req.params.film);
	}
	else if(err.message === 'UpdateError')
	{
		req.flash('PageError', 'There was a problem saving changes to the database.');
		res.redirect('/films' + req.params.film + '/edit');
	}
	else
	{
		next(err);
	}
});

module.exports = router;