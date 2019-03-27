/* INCLUDES */
const omdb = require('./omdb');
const flash = require('connect-flash');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Film = require('../models/filmModel')
var titleCase = require('title-case');

app.use(flash());

function addToDatabase(film, res)
{
	console.log("Adding film to database. Here's the info.");
	console.log(film);

	return new Promise((resolve, reject) => {
		film.save()
		.then(() => {return resolve();})
		.catch((err) => {
			console.log(err);
			return reject(new Error("FilmSaveError", film));
		});
	});
}

/* Construct the film object to add to the database */
function makeFilm(req, title, info)
{
	return {
		name: title,
		rating: req.body.rating,
		poster: info.Poster,
		imdbId: info.imdbID,
		plot: info.Plot,
		mpaa: info.Rated,
		cast: info.Actors,
		runtime: info.Runtime,
		year: info.Released,
		user: req.session.user,
	};
}

function logFilm(req, res) 
{
	//Convert user text into title case
    const title = titleCase(req.body.title);	    
	console.log("title is " + title);

	//Promise to retrieve the info from OMDB
	return new Promise ((resolve, reject) => {
		//Call on the OMDB API to see if we can get info on the film
		omdb.getJson(title)
		.then((info) => {
			var film = new Film(makeFilm(req, title, info));
			
			addToDatabase(film, res)
			.then(() => { return resolve(); })		//successfully added
			.catch(() => { return reject(); });		//mongoose error			
		})
		//getJson was unsuccessful
		.catch((err) => {
			console.error("in film logger CATCH, the error was");
			console.error(err.message);
			return reject(err);
// 			req.flash("apiError", err);
// 			res.redirect('/');
		});
	});
}



module.exports.logFilm = logFilm;