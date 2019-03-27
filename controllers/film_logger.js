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
			throw new Error("FilmSaveError", film);
			return reject();
		});
	});
}

/* Construct the film object to add to the database */
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

	//Convert user text into title case
    const title = titleCase(req.body.title);	    
	console.log("title is " + title);

	//Promise to retrieve the info from OMDB
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