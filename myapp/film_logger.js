/* INCLUDES */
const filmGetter = require('./film_getter');

/* MODULE */
var film_logger = {
    logFilm: function(req, res, title) {
        //Call on the OMDB API to see if we can get info on the film
        filmGetter.getjson(req.query.title, (err, film_info) => {
            //There was a problem calling the API
            if(err)
            {
                console.log("Oops! " + err);
                req.app.locals.error = err;
                res.redirect('/');
            }
            //A movie exists on OMDB, so proceed
            else
            {
                //Get the index of where to insert the film
                let default_films = req.app.locals.films.length;
                let user_films = req.app.locals.userfilms.length;
                let id = default_films + user_films;

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

module.exports = film_logger;