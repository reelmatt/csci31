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
 *  logger()
 *  Purpose: log the current films stored in arrays
 *	  Input: film_number, the unique ID/index of film you are trying to access
 *			 locals, the storage object where the films and userfilms arrays are kept
 */
function logger (filmNumber, locals)
{
    console.log("films are...");
    console.log(locals.films);
    console.log("userfilms are...");
    console.log(locals.userfilms);
    console.log("getting film #%d\n", filmNumber);
}

/*
 *  getJson()
 *  Purpose: poll the OMDB API to get a JSON response of film information
 *	  Input: film_title, name of the film to get info on
 *			 callback, function to return error, or film_info back to film.js router
 */
function getJson (filmTitle, callback)
{
    //construct OMDB url
    let url = getUrl(filmTitle);

    //Handle the request to the OMDB API
    http.get(url, function(res) {
        const { statusCode } = res;
        
        //Check for error calling API
        if(statusCode != 200)
            callback(`Error making API call: ${statusCode}`);
        else
        {
            res.setEncoding('utf8');
            let responseData = "";
            
            //Store the response in a variable
            res.on('data', (chunk) => {
                responseData += chunk;
            });
        
            //Once complete, return the data or call an error
            res.on('end', function() {
                var jsonContent = JSON.parse(responseData);
                
                //Check that "Response" was true
                //OMDB will return 200 even if movie doesn't exist
                if(jsonContent.Response == "True")
                    callback(null, jsonContent);
                else
                    callback("Movie not found.", null);
                
            });
        }
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
var film_getter = {
    getFilm: getFilm,
    getJson: getJson,
    logger: logger
};


module.exports = film_getter;