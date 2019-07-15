/************************************
 * Require module dependencies
 ************************************/
const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();
const app = express();

/************************************
 * Handlebars setup
 ************************************/
const hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper("title", () => {return process.env.APP_NAME;});
hbs.localsAsTemplateData(app);

// Setup view engine
app.use(bodyparser.urlencoded({extended: false}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

/************************************
 * Mongoose setup
 ************************************/
const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@cluster0-ferqm.mongodb.net/${process.env.DB_NAME}?retryWrites=true`, {
	useNewUrlParser: true,
	useFindAndModify: false
})
.catch((err) => {
	console.error(`database connection error: ${err}`);
	//process.exit();
});

/************************************
 * Load middleware
 ************************************/
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
app.use(flash());

// Middleware to store user in locals; used by Handlebars
app.use((req, res, next) => {
	res.locals.user = req.session.user;
	next();
});

/************************************
 * Setup routers and routes
 ************************************/
// ROUTERS
const indexRouter = require('./routes/index');
const logRouter = require('./routes/log');
const filmRouter = require('./routes/film');

// ROUTES
app.use('/', indexRouter);
app.use('/about', indexRouter);
app.use('/login', indexRouter);
app.use('/logout', indexRouter);
app.use('/log', logRouter);
app.use('/films', filmRouter);

/************************************
 * Error handling
 ************************************/
// 404 error -- pass to handler
app.use( (req, res, next) => { next(createError(404)); } );

// Error handler
app.use( (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
