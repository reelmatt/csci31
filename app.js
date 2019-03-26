/* INCLUDES */
const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const logger = require('morgan');
const app = express();
require('dotenv').config();


/* CONTROLLERS */
const filmGetter = require('./controllers/film_getter');

/* DATABASE */
const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@cluster0-ferqm.mongodb.net/${process.env.DB_NAME}?retryWrites=true`,
	{useNewUrlParser: true})
.catch((err) => {
	console.error(`database connection error: ${err}`);
	process.exit();
});



// var db = mongoose.connection;
	
// var filmSchema = mongoose.Schema({
// 	name: {type: String, required:true},
// 	rating: Number
// });

// var Film = mongoose.model('Film', filmSchema);
// 
// var f1 = new Film({name: "Harry Potter", rating: 4});
// 
// 
// 
// 
// /* PROMISES */
// f1.save()
// .then( (film) => {console.log("saved " + film); })
// .then( () => {
// 	console.log("step 2, film is");
// 	Film.find({})
// 	.then( (films) => {			
// 			console.log("found films...\n" + films);
// 			films[0].remove((err) => {
// 				console.log("removed record");
// 			});
// 	})
// 	
// })
// .catch((err) => console.error(err));



/* ORIGINAL VERSION
f1.save((err, film) => {
	if(err)
		console.log(err);

	console.log("saved " + film);
	Film.find({}, (err, films) => {
		if(err)
			console.log(err);
		else
		{
			console.log("found films...\n" + films);
			films[0].remove((err) => {
				console.log("removed record");
			});
		}
	});
})
*/	





//Flash messages
const session = require('express-session');
const flash = require('connect-flash');

/* ROUTES */
const indexRouter = require('./routes/index');
const logRouter = require('./routes/log');
const filmRouter = require('./routes/film');
// const loginRouter = require('./routes/login');



/* APP NAME FOR PAGE HEADERS */
app.locals.pageTitle = "Film Logger"

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
app.use(bodyparser.urlencoded({extended: false}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

/* LOAD MIDDLEWARE -- FROM express_generator */
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

/* PROCESS ROUTES */
app.use('/', indexRouter);
app.use('/about', indexRouter);
app.use('/login', indexRouter);
app.use('/logout', indexRouter);
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
