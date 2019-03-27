const Film = require('../models/filmModel');

function remove(req, res, next)
{
	Film.deleteOne({_id: req.params.film})
		.then((film) => {
			console.log("successfully delete film");
			console.log(film);
			res.redirect('/films');
		})
		.catch((err) => {
			console.log("there was an error removing the film");
			console.log(err);
			res.redirect('/films');
		});
}

function edit(req, res, next)
{
	Film.findById(req.params.film)
	.then((film) => {
		res.render('updateFilm', {
			user: req.session.user,
			film: film
		});
	})
	.catch((err) => {
		console.log("findById error of " + err);
		req.flash("apiError", "That film page does not exist!");
		res.redirect('/films/' + req.params.film);
	});
}

function index(req, res, next)
{
	console.log("IN THE /FILM router");
    
    //get all films in DB
	Film.find({})
	.then((films) => {
		res.render('diary', {
			user: req.session.user,
			films: films,
			userfilms: films
		});
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

function show(req, res, next)
{
	//Log some helpful info
    //filmGetter.logger(req.params.film, req.app.locals);

    //find which film we want, returns an object
    //var whichFilm = filmGetter.getFilm(req.params.film, req.app.locals);
	console.log("trying to find film ID: "+ req.params.film);
	Film.findById(req.params.film)
	.then((film) => {
		console.log("found the film. It is... ");
		console.log(film);
		
		res.render('film', {
			user: req.session.user,
			info: film
		});
	
	})
	.catch((err) => {
		console.log("findById error of " + err);
		req.flash("apiError", "That film page does not exist!");
		res.redirect('/films');
	});
}

function update(req, res, next)
{
	console.log("trying to find film ID: "+ req.params.film);
	Film.findById(req.params.film)
	.then((film) => {
		console.log("found the film. It is... ");
		console.log(film);
		
		var data = {
			rating: req.body.rating,
			posteR: req.body.poster
		}
		
		film.set(data);
		film.save()
		.then(() => {
			res.redirect('/films/' + req.params.film);
		})
		.catch((err) => {
			console.log("post error here... " + err);
		});

	})
	.catch((err) => {
		console.log("findById error of " + err);
		req.flash("apiError", "That film page does not exist!");
		res.redirect('/');
	});
}


module.exports.remove = remove;
module.exports.edit = edit;
module.exports.index = index;
module.exports.update = update;
module.exports.show = show;