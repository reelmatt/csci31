/* INCLUDES */
var express = require('express');
var router = express.Router();
const flash = require('connect-flash');
const auth = require('../controllers/auth');
router.use(flash());
const User = require('../models/userModel');

/* Home page. */
router.get('/', function(req, res, next) {
    console.log("current user is: " + req.session.user);
    res.render('index', {
		user: req.session.user,
        error: req.flash("apiError")
    });
});

/* Register new user */
router.post('/register', (req, res, next) => {
	var user = new User({
		user: req.body.user,
		email: req.body.email,
		password: req.body.password
	});
	
	console.log(user);
	
	user.save()
		.then(() => {
			console.log("added user");
			res.redirect("/");
		})
		.catch((err) => {
			console.log(err);
			throw new Error("UserRegistrationError", user);
		});
	
});

/* Login page. */
router.get('/login', (req, res)=>{
    res.render('login', {
		user: req.session.user
    });
})

/*
 *	This code is a 'stub', substituting for real authentication behavior.
 *	In a non-stub, here we'd check the credentials and, assuming they are good,
 *	set the user in session In this stub, we'll skip the authentication and just
 *	set a test user in session.
 */
router.post('/login', (req, res)=>{
    User.findOne({user: req.body.user, password: req.body.password})
    	.then((result) => {
    		console.log("here is the login result...");
    		console.log(result);
    		req.session.user = result.user;
    		res.redirect('/');
    	})
    	.catch((err) => {
    		console.log("user not found, could not log in");
    		
    	});
    
    //req.session.user = req.body.user;
    
})

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

module.exports = router;
