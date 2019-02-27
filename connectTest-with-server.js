var connect = require('connect');
var session = require('express-session');
const cookies = require('cookie-parser');
const serveStatic = require('serve-static');

var app = connect();
app.use(session({
        secret: "cscie31",
        resave: 'true',
        saveUninitialized: true,
        cookie: {maxAge: 60000}
    })
);

app.use(cookies());
app.use(serveStatic(__dirname + "/htdocs"));

var port = 8080;
app.listen(port, () => {
  console.log("Listening on " + port);
});
