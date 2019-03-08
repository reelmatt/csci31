var express = require('express');
var router = express.Router();

var http = require('http');
var request = require('request');
var fs = require('fs');

// request("http://www.omdbapi.com/?t=Star+Wars&apikey=34ca85f7", {json: true}, (err, res, body) => {
// 	if(err) {return console.log(err); }
// 	console.log(body.url);
// 	console.log(body.explanation);
// });

//http://www.omdbapi.com/?t=Star+Wars&apikey=34ca85f7

router.get('/', function(req, res, next) {
	res.render('film-index', {title: "Film Logger", films: req.app.locals.films})

});


/* GET home page. */
router.get('/:film', function(req, res, next) {
	console.log("in filmRouter... films are...");
	console.log(req.app.locals.films);
	console.log("getting film #...");
	console.log(`${req.params.film}`);
// 	var tempURI = "Ocean's Eleven";
// 	console.log(tempURI);
// 	var tempURI = encodeURI(tempURI);
// 	console.log(tempURI);

	var which_index = req.params.film;
	var which_film = req.app.locals.films[which_index];
	console.log("which film == " + which_film);

	var base = "http://www.omdbapi.com/?";
//	var title = "&t=" + tempURI;
	var title = "&t=" + encodeURI(which_film);
	var apikey = "apikey=34ca85f7";
	var url = base + apikey + title;

	getjson(url);
	
	console.log("in between GET and READ");
	
	var contents = fs.readFileSync('tmp.json', {encoding: 'utf8'}, (err, data) => {
		if(err){
			throw err;
		}
		console.log("Read file!!");
	});
	
	console.log("contents are...");
	console.log(contents);
	var jsoncontent = JSON.parse(contents);
	

	
	console.log("parsed data, results incoming...");
	console.log("Title: ", jsoncontent.Title);

//	res.render('film', {title: req.query.title, rating: req.query.rating});
    res.render('film', {title: "Film Logger", omdb: jsoncontent, rating: req.query.rating});
//  res.end('film', { title: req.query.title });
});



function getjson(url)
{
	console.log("IN getjson, url retrieving is..." + url);
	http.get(url, function(r) {
	r.setEncoding('utf8')

	r.on('data', function (d) {
		fs.writeFileSync('tmp.json', d, (err) => {
			if (err) {
				throw err;
			}
			console.log('The file has been saved!');
		});
		

	});

});
}

module.exports = router;