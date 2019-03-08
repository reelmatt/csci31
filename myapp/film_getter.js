/* INCLUDES */
var express = require('express');
var http = require('http');
var request = require('request');
var fs = require('fs');


//Helper function to read file 'tmp.json', parse JSON and return results
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

/* MODULE */
var film_getter = {
    //Construct the URL to pass into OMDB
    getUrl: function(film) {
        var base = "http://www.omdbapi.com/?";
        var title = "&t=" + encodeURI(film);
        var apikey = "apikey=" + process.env.OMDB;
        var url = base + apikey + title;
        
        console.log("in film_getter, URL is " + url);
        return url;
    },
    
    //Retrieve film information from OMDB URL, save to tmp.json
    getjson: function(url) {
        console.log("in getjson, url is..." + url);
        
        //var rs = fs.createReadStream(url);
        var ws = fs.createWriteStream('tmp.json');
        
/* @@TO-DO, implement as read/writeable streams to prevent partial file */
//         rs.on('data', (chunk) => {
//             console.log("chunk is ... " + chunk);
//             rs.pipe(ws);
//         })
//         
//         rs.on('end', function() {
//             console.log('The file has been saved!');
//             loadjson(url);
//         });

        //Write the info synchronously to 'tmp.json'
        http.get(url, function(res) {
            res.setEncoding('utf8');
            
            res.on('data', function(d) {
                fs.writeFileSync('tmp.json', d, (err) => {
                    if(err) {
                        throw err;
                    } 
                });
            });
            
            //Once complete, log it, and then load content
            res.on('end', function() {
                console.log('The file has been saved!');
                loadjson(url);
            });
        });
    },
    
    //Helper function to log the current films stored in arrays
    logFilms: function(locals, film_number) {
        console.log("in filmGetter... films are...");
        console.log(locals.films);
        console.log("in filmGetter... userfilms are...");
        console.log(locals.userfilms);
        console.log("\n\ngetting film #... " + film_number);
    }
};


module.exports = film_getter;