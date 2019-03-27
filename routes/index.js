/* INCLUDES */
var express = require('express');
var router = express.Router();
const flash = require('connect-flash');
const auth = require('../controllers/auth');
router.use(flash());
const User = require('../models/userModel');

/* Home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
		user: req.session.user,
        flashMsg: req.flash('apiError')
    });
});

/*
 *	Registration page:
 *	Pass in the session's user (if any). This will display appropriate
 *	navigation links. Also pass in the flash message, if exists.
 */
router.get('/register', (req, res)=>{
    res.render('register', {
		user: req.session.user,
		flashMsg: req.flash('UserRegistrationError')
    });
});

/*
 *	Register new user
 *	Add the username, email, and password from the HTML form to the database.
 */
router.post('/register', (req, res, next) => {
	//Assemble user object
	var user = new User({
		user: req.body.user,
		email: req.body.email,
		password: req.body.password
	});
	
	//Save it to the database
	user.save()
		.then(() => {
			res.redirect('/');
		})
		.catch((err) => {
			next(new Error("UserRegistrationError", user));
		});
	
});

/*
 *	Login page
 *	Pass in the session's user (if any). This will display appropriate
 *	navigation links. Also pass in the flash message, if exists.
 */
router.get('/login', (req, res)=>{
    res.render('login', {
		user: req.session.user,
		flashMsg: req.flash('LoginFailedError')
    });
});

/*
 *	This code is a 'stub', substituting for real authentication behavior.
 *	In a non-stub, here we'd check the credentials and, assuming they are good,
 *	set the user in session In this stub, we'll skip the authentication and just
 *	set a test user in session.
 *
 *	This code, including note above, was copied from week 8 examples. It was modified
 *	to include some rudimentary authentication checking that a user/password exists in
 *	the database. Usernames and passwords are stored in plain text and would need to be
 *	secured in a fully-functional, deployed, application.
 */
router.post('/login', (req, res, next)=>{
    var query = User.where({user: req.body.user, password: req.body.password});
    console.log(req.body.user + " and " + req.body.password);
    query.findOne((err, user) => {
		//mongoose had a problem
		if(err)
			next(new Error("DatabaseError", user));
		
		//user found, set for session
		if(user)										//user found, set for session
		{
			req.session.user = user.user;
			res.redirect('/');
		}
		//user not found, throw error
		else
		{
			next(new Error("LoginFailedError", user));
		}
	});
});

/*
 *	Logout page
 *	Reset the session's user and redirect back to the home page.
 */
router.get('/logout', (req, res)=>{
    req.session.user = undefined;
    res.redirect('/');
})

/* About page */
router.get('/about', function(req, res, next) {
    res.render('about', {
		user: req.session.user
    });
});

/* Error handler */
router.use((err, req, res, next) => {
	console.log("Error: " + err.message);
	if(err.message === "UserRegistrationError")
	{
		req.flash('UserRegistrationError', 'Registration unsuccessful.');
		res.redirect('/register');
	}
	else if(err.message === "LoginFailedError")
	{
		req.flash('LoginFailedError', 'That username/password was not found.');
		res.redirect('/login');
	}
	else if(err.message === "DatabaseError")
	{
		req.flash('DatabaseError', 'There was a database error. Try again.');
		res.redirect('/login');
	}
	else
	{
		next(err);
	}
});

module.exports = router;
