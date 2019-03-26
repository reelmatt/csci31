/* INCLUDES */
var express = require('express');
var router = express.Router();
const flash = require('connect-flash');


app.get('/login', (req, res)=>{
    res.render('login');
})
app.post('/login', (req, res)=>{
    // This code is a 'stub', substituting for real
    //  authentication behavior.
    // In a non-stub, here we'd check the credentials
    //  and, assuming they are good, set the user in session
    // In this stub, we'll skip the authentication and just set a test user in session.
    req.session.user = 'CSCIE31'
    res.redirect('/');
})
app.get('/logout', (req, res)=>{
    req.session.user = ''
    res.redirect('/');
})