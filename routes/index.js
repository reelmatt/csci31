/* INCLUDES */
var express = require('express');
var router = express.Router();
const flash = require('connect-flash');
const auth = require('../controllers/auth');

router.use(flash());

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { 
        title: 'Film Logger',
        error: req.flash("apiError")
    });
});

router.get('/login', (req, res)=>{
    res.render('login');
})

/*
 *	This code is a 'stub', substituting for real authentication behavior.
 *	In a non-stub, here we'd check the credentials and, assuming they are good,
 *	set the user in session In this stub, we'll skip the authentication and just
 *	set a test user in session.
 */
router.post('/login', (req, res)=>{
    req.session.user = 'CSCIE31'
    res.redirect('/');
})

router.get('/logout', (req, res)=>{
    req.session.user = ''
    res.redirect('/');
})

/* GET about page */
router.get('/about', auth.required, function(req, res, next) {
    res.render('about', {
        title: req.app.locals.pageTitle
    });
});

module.exports = router;
