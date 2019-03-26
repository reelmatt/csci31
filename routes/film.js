/* INCLUDES */
var express = require('express');
var router = express.Router();
//const app = express();
var http = require('http');
var request = require('request');
var fs = require('fs');


/* FLASH MESSAGES */
const flash = require('connect-flash');
router.use(flash());

/* CONTROLLERS */
const auth = require('../controllers/auth');
const filmGetter = require('../controllers/film_getter');

const Film = require('../models/filmModel');


/*
 *  get_default_film()
 *  Purpose: compare dropdown selection with array of default films
 *    Input: requested_film, query parameter from /film form submission
 *           default_films, array of default film Objects
 *   Return: undefined, if film not one of the default options;
 *           otherwise, index in the default_films array
 */
function getDefaultFilm(requestedFilm, defaultFilms)
{
    let index = undefined;

    //iterate through "films" default array to find correct object
    defaultFilms.forEach(film => {
        //if query matches film.title, store the index
        if(film.title == requestedFilm)
            index = film.id;        
    })
    
    return index;
}

/*
 *  get_user_film()
 *  Purpose: return a userfilm object if it has been logged
 */
function getUserFilm(req)
{
    //Render page with parsed info from jsoncontent
    let returnFilm = undefined;
    let defaultFilms = req.app.locals.films.length;
    let index = req.params.film - defaultFilms;

    if(index > 0)
        returnFilm = index;

    return req.app.locals.userfilms[index];
}

/*
 *	GET /films page
 */
router.get('/', function(req, res, next) {
    console.log("IN THE /FILM router");
    
    if(req.query.title)
    {
    	let whichFilm = "/films/" + req.query.title;
    	res.redirect(whichFilm);
    }
    else
    {
		Film.find({})
		.then((films) => {
			console.log("we found films! they are...");
			console.log(films);
				res.render('film-index', {
					title: req.app.locals.pageTitle,
					films: films,
					userfilms: films
				})
		})
		.catch((err) => {
			console.log("db search failed, here's why...");
			if(err)
			{
				console.log(err);
				res.end("ERROR!");
			}
		});
	}
 /*   
    //No query, load normal page
    if(!req.body.title)
    {
        res.render('film-index', {
            title: req.app.locals.pageTitle,
            films: req.app.locals.films,
            userfilms: req.app.locals.userfilms
        })    
    } 
    //Used form on /films page to pick default film, load page
    else
    {
        //get index in default_films array for form sumbmission
        let index = getDefaultFilm(req.query.title, req.app.locals.films);
        
        //If a match was found, direct to that page
        if (index != undefined)
            res.redirect('/films/' + index);
        else
            res.redirect(404);
    }*/
});

/*
 *	GET /films/# page.
 */
router.get('/:film', function(req, res, next) {
    //Log some helpful info
    //filmGetter.logger(req.params.film, req.app.locals);

    //find which film we want, returns an object
    //var whichFilm = filmGetter.getFilm(req.params.film, req.app.locals);
	console.log("trying to find film ID: "+ req.params.film);
	Film.findById(req.params.film, (err, film) => {
		if(err)
		{
			console.log("findById error of " + err);
			req.flash("apiError", "That film page does not exist!");
			res.redirect('/');
		}
		else
		{
			console.log("found the film. It is... ");
			console.log(film);
			
			res.render('film', {
				title: req.app.locals.pageTitle,
				info: film
			});
		}
	})
	
	
 /*   //if the film has been logged
    if(whichFilm)
    {
        //Pull in data from OMDB, parse, and render the page
        filmGetter.getJson(whichFilm.title, (err, filmInfo) => {
            if(err)
            {
                //req.app.locals.error = err;
                req.flash("apiError", err);
                res.redirect('/');
            }
            else
            {
                //if it is a user film, pull in object
                let requestedUserFilm = getUserFilm(req);
                
                //render page
                res.render('film', {
                    title: req.app.locals.pageTitle,
                    omdb: filmInfo,
                    userfilms: requestedUserFilm
                });
            }
        });
    }*/
    //the film has not been logged, return error message
//     else
//     {
//     	req.flash("apiError", "That film page does not exist!");
//         res.redirect('/');
//     } 
});



module.exports = router;