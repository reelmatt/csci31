/* INCLUDES */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/* ROUTES */
var indexRouter = require('./routes/index');
var logRouter = require('./routes/log');
var usersRouter = require('./routes/users');
var filmRouter = require('./routes/film');

var app = express();

/* STARTER FILMS */
const defaults = [
	"Star Wars",
	"Jaws",
	"The Return of the King",
	"Good Will Hunting",
	"Ocean's Eleven"
]

const userfilms = []

app.locals.films = defaults;
app.locals.userfilms = userfilms;

/* VIEW ENGINE */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

/* LOAD MIDDLEWARE -- FROM express_generator */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* PROCESS ROUTES */
app.use('/', indexRouter);
app.use('/add-film', logRouter);
app.use('/films', filmRouter);

/* 404 error -- pass to handler */
app.use(function(req, res, next) {
  next(createError(404));
});

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
