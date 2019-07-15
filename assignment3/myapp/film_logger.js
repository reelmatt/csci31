/* INCLUDES */
const filmGetter = require('./film_getter');

/* MODULE */
var filmLogger = {
    logFilm: function(req, res, title) {
        //Call on the OMDB API to see if we can get info on the film
        filmGetter.getJson(req.query.title, (err, film_info) => {
            //There was a problem calling the API
            if(err)
            {
                req.app.locals.error = err;
                res.redirect('/');
            }
            //A movie exists on OMDB, so proceed
            else
            {
                //Get the array lengths to calculate the index for insertion
                let defaultFilms = req.app.locals.films.length;
                let userFilms = req.app.locals.userfilms.length;
                let id = defaultFilms + userFilms;
                
                //add to array of user's films
                req.app.locals.userfilms.push({
                    title: title,
                    id: id,
                    rating: req.query.rating
                });

                //redirect user to the film they just logged
                res.redirect('/films/' + id);	
            }
        });
    }
};

module.exports = filmLogger;