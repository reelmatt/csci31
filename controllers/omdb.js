/* INCLUDES */
var express = require('express');
var http = require('http');
var request = require('request');
var fs = require('fs');

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
				console.err("API call error");
				return reject(new Error('ResponseError', res.statusCode));
// 				return reject({
// 					statusCode: res.statusCode,
// 					message: "API ERROR"
// 				});
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
						return reject(new Error('MovieNotFound'));
						//return reject("Movie not found.");
				
				});
			}
		});
	}); 
}

/*
 *	getFilm()
 *	Purpose: retrieve a film Object
 *	  Input: index, the unique film ID the user is trying to load
 *			 storage, where the 'films' and 'userfilms' arrays are stored
 *	 Return: Object that contains info on the requested film
 */
function getFilm (index, storage)
{
	//Figure out how many "default" films there are
	let filmsIndex = storage.films.length - 1;

	//If the index is within the # of default films, get it
	//Otherwise, get the user film that was logged
	if(index <= filmsIndex)
		return storage.films[index];
	else
		return storage.userfilms[index - filmsIndex - 1];
}


/* MODULE */
module.exports.getFilm = getFilm;
module.exports.getJson = getJson;