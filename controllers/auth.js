const auth = {
	// Middleware function which tests that a user property is present in session.
	required: function (req, res, next){
		if (req.session.user)
			return next();			// if user present, continue with the next() middlware
		else
			res.redirect('/login');
  },
	// Middleware function which allows access no matter what
	optional: function(req, res, next){
		next();
	},
};

module.exports = auth;

// you can imagine creating other functions besides 'required' and 'optional' here...
//  e.g. 'adminsOnly' or 'resourceOwner'   