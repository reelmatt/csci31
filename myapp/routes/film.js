/* INCLUDES */
var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');
var fs = require('fs');

/* HELPER MODULE */
const filmGetter = require('../film_getter');


/*
 *  get_default_film()
 *  Purpose: compare dropdown selection with array of default films
 *    Input: requested_film, query parameter from /film form submission
 *           default_films, array of default film Objects
 *   Return: undefined, if film not one of the default options;
 *           otherwise, index in the default_films array
 */
function get_default_film(requested_film, default_films)
{
    let index = undefined;

    //iterate through "films" default array to find correct object
    default_films.forEach(film => {
        //if query matches film.title, store the index
        if(film.title == requested_film)
            index = film.id;        
    })
    
    return index;
}

/*
 *  get_user_film()
 *  Purpose: return a userfilm object if it has been logged
 */
function get_user_film(req)
{
    //Render page with parsed info from jsoncontent
    let return_film = undefined;
    let default_films = req.app.locals.films.length;
    let index = req.params.film - default_films;

    if(index > 0)
        return_film = index;

    return req.app.locals.userfilms[index];
}

/* GET /films page */
router.get('/', function(req, res, next) {
    //No query, load normal page
    if(!req.query.title)
    {
        res.render('film-index', {
            title: "Film Logger",
            films: req.app.locals.films,
            userfilms: req.app.locals.userfilms
        })    
    } 
    //Used form on /films page to pick default film, load page
    else
    {
        //get index in default_films array for form sumbmission
        let index = get_default_film(req.query.title, req.app.locals.films);
        
        //If a match was found, direct to that page
        if (index != undefined)
            res.redirect('/films/' + index);
        else
            res.redirect(404);
    }
});

/* GET /films/# page. */
router.get('/:film', function(req, res, next) {
    //Log some helpful info
    filmGetter.logFilms(req.params.film, req.app.locals);

    //find which film we want, returns an object
    var which_film = filmGetter.getfilm(req.params.film, req.app.locals);

    //if the film has been logged
    if(which_film)
    {
        //Pull in data from OMDB, parse, and render the page
        filmGetter.getjson(which_film.title, (err, film_info) => {
            if(err)
            {
                console.log("Oops! " + err);
                req.app.locals.error = err;
                res.redirect('/');
            }
            else
            {
                //if it is a user film, pull in object
                let req_user_film = get_user_film(req);
                
                //render page
                res.render('film', {
                    title: "Film Logger",
                    omdb: film_info,
                    userfilms: req_user_film
                });
            }
        });
    }
    //the film has not been logged, return error message
    else
    {
        console.log("Oops!");
        req.app.locals.error = "That film page does not exist!";
        res.redirect('/');
    } 
});

module.exports = router;