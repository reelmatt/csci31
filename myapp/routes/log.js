var express = require('express');
var router = express.Router();
const filmGetter = require('../film_getter');


var http = require('http');
var request = require('request');
var fs = require('fs');



router.get('/', function(req, res, next) {

	console.log("In logRouter");
	console.log(req.query.title);
	req.app.locals.userfilms.push(req.query.title);
	var index = req.app.locals.films.length - 1;
	var newfilm = '/films/' + index;
	
	console.log(req.app.locals.films);
    console.log(req.app.locals.userfilms);
	res.redirect(newfilm);
});


/* GET home page. */
// router.get('/:film', function(req, res, next) {
// 	console.log("getting film #...");
// 	console.log(`${req.params.film}`);
// 
// 
//     var url = filmGetter.getUrl(req.query.title);
// 
// 
// 	filmGetter.getjson(url);
// 	
// 	console.log("in between GET and READ");
// 	
// 	var contents = fs.readFileSync('tmp.json', {encoding: 'utf8'}, (err, data) => {
// 		if(err){
// 			throw err;
// 		}
// 		console.log("Read file!!");
// 	});
// 	
// 	console.log("contents are...");
// 	console.log(contents);
// 	var jsoncontent = JSON.parse(contents);
// 	
// 
// 	
// 	console.log("parsed data, results incoming...");
// 	console.log("Title: ", jsoncontent.Title);
// 
// //	res.render('film', {title: req.query.title, rating: req.query.rating});
//     res.render('film', {title: "Film Logger", omdb: jsoncontent, rating: req.query.rating});
// //  res.end('film', { title: req.query.title });
// });





module.exports = router;