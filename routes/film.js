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
const omdb = require('../controllers/omdb');
const filmController = require('../controllers/film');
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


router.get('/', auth.required, filmController.index);					//Film index
router.get('/:film', auth.required, filmController.show);				//Show film info
router.get('/:film/edit', auth.required, filmController.edit);			//Edit film
router.post('/:film', auth.required, filmController.update);			//Save film changes
router.get('/:film/delete', auth.required, filmController.remove)	//Delete film
module.exports = router;