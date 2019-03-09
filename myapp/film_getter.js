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
 */
function getUrl(film) {
    var base = "http://www.omdbapi.com/?";
    var title = "&t=" + encodeURI(film);
    var apikey = "apikey=" + process.env.OMDB;
    var url = base + apikey + title;
    
    console.log("in film_getter, URL is " + url);
    return url;
}

/*
 *  logFilms()
 *  Purpose: log the current films stored in arrays
 */
function logFilms (film_number, locals)
{
    console.log("in filmGetter... films are...");
    console.log(locals.films);
    console.log("in filmGetter... userfilms are...");
    console.log(locals.userfilms);
    console.log("getting film #%d\n", film_number);
}

/*
 *  getjson()
 *  Purpose: poll the OMDB API to get a JSON response of film information
 */
function getjson (film_title, callback)
{
    //construct OMDB url
    let url = getUrl(film_title);

    //Handle the request to the OMDB API
    http.get(url, function(res) {
        const { statusCode } = res;
        
        if(statusCode != 200)
            callback(`Error making API call: ${statusCode}`);
        else
        {
            res.setEncoding('utf8');
            let responseData = "";
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
        
            //Once complete, log it, and then load content
            res.on('end', function() {
                var jsoncontent = JSON.parse(responseData);
                
                //Check that "Response" was true
                //OMDB will return 200 if movie doesn't exist
                if(jsoncontent.Response == "True")
                    callback(null, jsoncontent);
                else
                    callback("Movie not found.", null);
                
            });
        }
    });
}

/* MODULE */
var film_getter = {
    //Retrieve film Object
    getfilm: function(index, storage) {
        //
        let films_index = storage.films.length - 1;

        //If the index is within the # of default films, get it
        //Otherwise, get the user film that was logged
        if(index <= films_index)
            return storage.films[index];
        else
            return storage.userfilms[index - films_index - 1];
    },
    

    getjson: getjson,
    logFilms: logFilms
};


module.exports = film_getter;