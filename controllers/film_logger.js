/* INCLUDES */
const omdb = require('./film_getter');
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
			throw new Error("FilmSaveError", film);
			return reject();
		});
	});
}

function makeFilm(title, rating, info)
{
	return {
		name: title,
		rating: rating,
		poster: info.Poster
	};
}

function logFilm(req, res) 
{
	console.log("IN LOG FILM");

    const title = titleCase(req.body.title);	    //Convert user text into title case
	console.log("title is " + title);

	return new Promise ((resolve, reject) => {
		//Call on the OMDB API to see if we can get info on the film
		omdb.getJson(title)
		.then((info) => {
			var film = new Film(makeFilm(title, req.body.rating, info));
			
			addToDatabase(film, res)
			.then(() => {			
				console.log("passed, added to database");
				return resolve();
			})
			.catch(() => {
				console.log("nope, not added. Try again");
				return reject();
			});
			
	//		return (addToDatabase(film, res) ? resolve() : reject());
		})
		.catch((err) => {
			console.error("in film logger CATCH, the error was");
			console.error(err);
			req.flash("apiError", err);
			res.redirect('/');
		});
	});
}

module.exports.logFilm = logFilm;