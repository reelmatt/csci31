/************************************
 * Setup for index.js
 ************************************/
// INCLUDES
var express = require('express');
var router = express.Router();
const flash = require('connect-flash');
router.use(flash());

// CONTROLLERS
const auth = require('../controllers/auth');

// MODELS
const User = require('../models/userModel');

/************************************
 * Routers for index.js
 ************************************/
// Home page
router.get('/', function(req, res) {
    res.render('index');
});

// About page
router.get('/about', (req, res) => {
    res.render('about');
});

// Registration page
router.get('/register', (req, res) => { 
    res.render('register', { flashMsg: req.flash('UserRegistrationError') });
});

// Register new user: Add username, email, and password from HTML form to database.
router.post('/register', (req, res) => {
	auth.createUser(req).save()
	.then((user) => {
		req.session.user = user.user; 
		res.redirect('/'); 
	})
	.catch((err) => { next(new Error("UserRegistrationError", user)); });
});

// Login page
router.get('/login', (req, res) => {
    res.render('login', { flashMsg: req.flash('LoginFailedError') });
});

/*
 *	Check user's login info with database.
 *	Set user for session on success. Error on failure.
 *
 *	This code was copied from week 8 examples. It was modified to include some
 *	rudimentary authentication checking that a user/password exists in the
 *	database. Usernames and passwords are stored in plain text and would need
 *	to be secured in a fully-functional, deployed, application.
 */
router.post('/login', (req, res, next) => {
    var query = User.where({user: req.body.user, password: req.body.password});

    query.findOne((err, user) => {
		if(err)
			next(new Error("DatabaseError", user));		//mongoose had a problem
		
		if(!user)
			next(new Error("LoginFailedError", user));	//user not found
		else
		{
			req.session.user = user.user;				//user found, set for session
			res.redirect('/');
		}
	});
});

// Logout page
router.get('/logout', (req, res) => {
    req.session.user = undefined;
    res.redirect('/');
})

/************************************
 * Error handler for index.js
 ************************************/
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
