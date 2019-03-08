/* INCLUDES */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv').config();
const filmGetter = require('./film_getter');

/* ROUTES */
const indexRouter = require('./routes/index');
const logRouter = require('./routes/log');
const filmRouter = require('./routes/film');

const app = express();

/* STARTER FILMS */
app.locals.films = [
	{title: "Star Wars", id: 0},
	{title: "Jaws", id: 1},
	{title: "The Return of the King", id: 2},
	{title: "Good Will Hunting", id: 3},
	{title: "Ocean's Eleven", id: 4}
]

app.locals.userfilms = []


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
app.use('/about', indexRouter);
app.use('/log', logRouter);
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
