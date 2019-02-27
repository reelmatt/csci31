var express = require('express');
var path = require('path');

var app = express();

app.use('/', express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	res.status(404);
	res.send("Sorry, this file cannot be found");
	//or, res.redirect('/static/friendly404.html');
});

/* stack-trace, full-blown error version

app.use((req, res, next) => {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
})

*/

/*
app.use((req, res) => {
	res.end("hello from express!")
});
*/
module.exports = app;