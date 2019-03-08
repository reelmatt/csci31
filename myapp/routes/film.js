var express = require('express');
var router = express.Router();
const filmGetter = require('../film_getter');

var http = require('http');
var request = require('request');
var fs = require('fs');

router.get('/', function(req, res, next) {
	res.render('film-index', {title: "Film Logger", films: req.app.locals.films})
});

/* GET home page. */
router.get('/:film', function(req, res, next) {
// 	console.log("in filmRouter... films are...");
// 	console.log(req.app.locals.films);
//     console.log("in filmRouter... userfilms are...");
// 	console.log(req.app.locals.userfilms);
// 	console.log("\n\ngetting film #... " + `${req.params.film}`);
    filmGetter.logFilms(req.app.locals, req.params.film);

	var index = req.params.film;
    var url = filmGetter.getUrl(req.app.locals.films[index]);

	filmGetter.getjson(url);
	

	var contents = fs.readFileSync('tmp.json', {encoding: 'utf8'}, (err, data) => {
		if(err){
			throw err;
		}
		console.log("Read file!!");
	});
	
	console.log("contents are...");
//	console.log(contents);
	var jsoncontent = JSON.parse(contents);
	

	console.log("Title: ", jsoncontent.Title);

    res.render('film', {
        title: "Film Logger",
        omdb: jsoncontent,
        rating: req.query.rating
    });
});

module.exports = router;