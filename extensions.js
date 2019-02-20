const path = require('path');

const mimeTypes = {
	'html' : "text/html",
	'css'  : "text/css",
	'js'   : "text/javascript",
	'png'  : "image/png",
	'jpg'  : "image/jpg"
};

var toExport = {
	/* Lookup a mimetype given a filename extension */
	getType: function(pathname) {
		var extname = String(path.extname(pathname)).toLowerCase();

		//if the first char is a period, strip it
		if (extname.charAt(0) == '.')
			extname = extname.substr(1);

		//return corresponding mimeType, undefined if not present
		return mimeTypes[extname];
	},

	/* Convert an array of FILES into paragraph-separated links */
	getListing: function(files) {
		var s = '<h1>Directory Listing</h1><div class="links">';

		files.forEach((i) => {
			s += ('<p><a href="' + i + '">' + i + '</a></p>');
		});

		s += "</div>"; //close it
		return s;
	},

	/* Log key: value pairs from query string to console*/
	logQuery: function(query) {
		for (var key in query) {
			console.log("%s: %s", key, query[key]);
		}
	}
};

/* Export object to use in simple-http-server.js */
module.exports = toExport;