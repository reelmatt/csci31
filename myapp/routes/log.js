/* INCLUDES */
var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');
var fs = require('fs');
var titleCase = require('title-case');

/* HELPER MODULE */
const filmGetter = require('../film_getter');

/* the /log path -- action for form submission */
router.get('/', function(req, res, next) {
    //Conver user text into title case
    const title = titleCase(req.query.title);
	console.log(title);
	
	//Get the index of where to insert the film
    var num_films = req.app.locals.films.length;

    //create film object with the user information
    const newfilm = {
	    title: req.query.title,
	    id: num_films,
	    rating: req.query.rating
	};
	
    //add to arrays tracking films
	req.app.locals.userfilms.push(newfilm);
    req.app.locals.films.push(newfilm);

    //redirect user to the film they just logged
	res.redirect('/films/' + num_films);
});

module.exports = router;