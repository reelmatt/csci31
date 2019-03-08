/* INCLUDES */
var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');
var fs = require('fs');

/* HELPER MODULE */
const filmGetter = require('../film_getter');

/* GET /films page */
router.get('/', function(req, res, next) {
	res.render('film-index', {
	    title: "Film Logger",
	    films: req.app.locals.films,
	    userfilms: req.app.locals.userfilms
	})
});

/* GET /films/# page. */
router.get('/:film', function(req, res, next) {
    //Log some helpful info
    filmGetter.logFilms(req.app.locals, req.params.film);

    //find which film we want
	var index = req.params.film;
	var which_film = req.app.locals.films[index];

    //assemble url to send to OMDB API
    var url = filmGetter.getUrl(which_film.title);

    //Download JSON content into a tmp.json file, read, and parse
	var film_info = filmGetter.getjson(url);

    //Render page with parsed info from jsoncontent
    res.render('film', {
        title: "Film Logger",
        omdb: film_info,
        rating: req.query.rating,
        userfilms: req.app.locals.userfilms
    });
});

module.exports = router;