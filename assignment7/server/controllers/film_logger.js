/***************************************
 * Setup for film_logger.js
 ***************************************/
// INCLUDES
const express = require('express');
const app = express();
var http = require('http');
var titleCase = require('title-case');

// MODELS
const Film = require('../models/filmModel')


/***************************************
 * Helper functions for film_logger.js
 ***************************************/
/*
 *	addToDatabase()
 *	Purpose: 
 */
function addToDatabase(film)
{
	console.log("Adding film to database. Here's the info.");
	console.log(film);

	return new Promise((resolve, reject) => {
		film.save()
		.then(() => { return resolve(); })
		.catch((err) => { return reject(new Error("FilmSaveError", film)); });
	});
}

/*
 *  getUrl()
 *  Purpose: construct the URL to access film info from OMDB
 *    Input: film, name of the film to get info on
 *   Output: url, the fully-constructed URL to send to the OMDB API
 *	   Note: To make a request to the OMDB API, you must have an API key.
 *			 For this app, it is stored in a .env and loaded using the .dotenv
 *			 module. The .env file should be created by each person trying to run
 *			 this app on their own. Visit http://www.omdbapi.com/apikey.aspx to
 *			 obtain your own API key.
 */
function getUrl(film) {
    var base = "http://www.omdbapi.com/?";
    var apiKey = "apikey=" + process.env.OMDB;
    var title = "&t=" + encodeURI(film);
    var url = base + apiKey + title;
    
    return url;
}

/*
 *  getJson()
 *  Purpose: poll the OMDB API to get a JSON response of film information
 *	  Input: film_title, name of the film to get info on
 */
function getJson (filmTitle)
{
	//construct OMDB url
    let url = getUrl(filmTitle);
    
	return new Promise((resolve, reject) => {
		http.get(url, (res) => {					//Handle the request to the OMDB API
			if(res.statusCode != 200)				//Check for error calling API
			{
				return reject(new Error('ResponseError', res.statusCode));	//API error
			}
			else
			{
				res.setEncoding('utf8');
				let data = "";
			
				//Store the response in a variable
				res.on('data', (chunk) => {data += chunk;});
		
				//Once complete, return the data or call an error
				res.on('end', () => {
					var info = JSON.parse(data);
					console.log(info);
					
					//Check that "Response" was true
					//OMDB will return 200 even if movie doesn't exist
					if(info.Response === 'True')
						return resolve(info);
					else
						return reject(new Error('MovieNotFound'))
				});
			}
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

/* API to access the film database -- modified from course-provided week 9 code */
class FilmService{
	static list(user) {
		console.log("API call to list()");
		return Film.find({user: user})
			.then((films) => {
				return films;
			});
	}

	static create(obj) {
		console.log("API call to create()");
		return logFilm(obj)
			.then((film) => {
				return film;
			})
	}
	
	static read(id) {
		console.log("API call to read()");
		return Film.findById(id)
			.then((film) => {
				return film;
			});
	}
	
	static update(id, data) {
		console.log("API call to update()");
		return Film.findByIdAndUpdate(id, data)
			.then((film) => {
				film.save();
				return film;
			})
	}
	
	static delete(id) {
		console.log("API call to delete()");
		return Film.findByIdAndDelete(id)
			.then((obj) => {
				return obj;
			})
	}
	
};


/***************************************
 * Controller module
 ***************************************/
/*
 *	logFilm()
 */
function logFilm(req) 
{
	//Convert user text into title case
    const title = titleCase(req.body.title);	    
	console.log('title is ' + title);

	//Promise to retrieve the info from OMDB
	return new Promise ((resolve, reject) => {
		getJson(title)								//get film info from OMDB
		.then((info) => {
			var film = new Film(makeFilm(req, title, info));
			
			addToDatabase(film)
			.then(() => { return resolve(film); })	//successfully added
			.catch(() => { return reject(); });		//mongoose error			
		})
		.catch((err) => { return reject(err); });	//getJson was unsuccessful
	});
}

module.exports.logFilm = logFilm;
module.exports.FilmService = FilmService;