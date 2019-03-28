
/* MODELS */
const User = require('../models/userModel');

/*
 *	This code was copied from the week 8 sample code on GitHub. This is used
 *	for user authorization and authentication with other routers/controllers.
 */
const auth = {
	// Middleware function which allows access no matter what
	optional: (req, res, next) => { next(); },
	// Middleware function which tests that a user property is present in session.
	required: (req, res, next) => {
		// if user present, continue with the next() middlware
		if (req.session.user)
			return next();
		else
			res.redirect('/login');
	},
	// Creates a user to add to the database
	createUser: (req) => {
		return new User({
			user: req.body.user,
			email: req.body.email,
			password: req.body.password
		});
	},
};

module.exports = auth;