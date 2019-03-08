var express = require('express');
var http = require('http');
var request = require('request');
var fs = require('fs');

function loadjson(url) {

    var contents = fs.readFileSync('tmp.json', {encoding: 'utf8'}, (err, data) => {
        if(err){
            throw err;
        } else {
        console.log("Read file!!");
        }
    });
    
    console.log("contents are...");
	var jsoncontent = JSON.parse(contents);

	console.log("Title: ", jsoncontent.Title);
	return jsoncontent;
}

var film_getter = {
    getUrl: function(film) {
        var base = "http://www.omdbapi.com/?";
        var title = "&t=" + encodeURI(film);
        var apikey = "apikey=" + process.env.OMDB;
        var url = base + apikey + title;
        
        console.log("in film_getter, URL is " + url);
        return url;
    },
    getjson: function(url) {
        console.log("in getjson, url is..." + url);
        
        http.get(url, function(r) {
            r.setEncoding('utf8');
            
            r.on('data', function(d) {
                fs.writeFileSync('tmp.json', d, (err) => {
                    if(err) {
                        throw err;
                    } 
                });
            });
            
            r.on('end', function() {
                console.log('The file has been saved!');
                loadjson(url);
            });
        });
    },
    
    logFilms: function(locals, film_number) {
        console.log("in filmGetter... films are...");
        console.log(locals.films);
        console.log("in filmGetter... userfilms are...");
        console.log(locals.userfilms);
        console.log("\n\ngetting film #... " + film_number);
    }


};


module.exports = film_getter;