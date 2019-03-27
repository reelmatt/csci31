/*
 *	This code was copied from the week 8 sample code on GitHub. This is used
 *	for user authorization and authentication with other routers/controllers.
 */
const auth = {
	// Middleware function which tests that a user property is present in session.
	required: function (req, res, next){
		// if user present, continue with the next() middlware
		if (req.session.user)
			return next();
		else
			res.redirect('/login');
  },
	// Middleware function which allows access no matter what
	optional: function(req, res, next){
		next();
	},
};

module.exports = auth;