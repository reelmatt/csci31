/* INCLUDES */
const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const logger = require('morgan');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const hbs = require('hbs');

/* Handlebars helpers */
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper("title", () => {return process.env.APP_NAME;});

/* DATABASE */
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@cluster0-ferqm.mongodb.net/${process.env.DB_NAME}?retryWrites=true`,
	{useNewUrlParser: true})
.catch((err) => {
	console.error(`database connection error: ${err}`);
	process.exit();
});

//Flash messages
const session = require('express-session');
const flash = require('connect-flash');
app.use(flash());

/* VIEW ENGINE */
app.use(bodyparser.urlencoded({extended: false}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

/* LOAD MIDDLEWARE */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('csci-secret'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret: "csci-secret",
	resave: "true",
	saveUninitialized: "true"
}));

/* ROUTERS */
const indexRouter = require('./routes/index');
const logRouter = require('./routes/log');
const filmRouter = require('./routes/film');

/* ROUTES */
app.use('/', indexRouter);
app.use('/about', indexRouter);
app.use('/login', indexRouter);
app.use('/logout', indexRouter);
app.use('/log', logRouter);
app.use('/films', filmRouter);

/* 404 error -- pass to handler */
app.use( (req, res, next) => { next(createError(404)); } );

/* Error handler */
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
