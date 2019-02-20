// start by navigating to the folder, and type 'node ../simple-http-file-server'
// access the app from you browser at http://localhost:8080/ (add any arbitrary path)

const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const ext = require('./extensions');
const log = require('log-util');

const errorCodes = {
	'404' : "404: Page Not Found!",
	'500' : "Server Error 500",
};

var server = http.createServer((req, res) => {
	log.debug(req.url);

	const parsedUrl = url.parse(req.url, true);	// parse URL into component parts
	log.debug(parsedUrl);

	const { pathname, query } = parsedUrl;		// extract pathname & query props

	log.debug('__dirname is ' + __dirname);		// log absolute path info
	log.debug('cwd is ' + process.cwd());		// log current working dir

	/* call to my extension module */
	ext.logQuery(query);						// Log the query key:value pairs

	processPath(res, pathname);					// process the path (file or dir)
});


/* Take a requested path and generate response for file, dir, or error */
function processPath(response, pathname)
{
	// Create absolute path to requested file. Assume server started from webroot
	const absolute_path = path.join(__dirname, pathname);
	log.debug('absolute_path is ', absolute_path);

	/* call to my extension module */
	var contentType = ext.getType(pathname);	//set mimetype (undefined if not known)

	//Read in file requested from URL
	fs.readFile(absolute_path, (err, data) => {
		//check error cases first
		if (err)
		{
			log.error(err);

			if (err.code == 'ENOENT')			//file doesn't exist, return 404
			{
				log.warn('404 error getting ' + pathname);
				outputHeader(response, contentType, 404);
				response.end(errorCodes[404]);
			}
			else if (err.code == 'EISDIR')		//is dir, create dir listing
			{
				getDir(absolute_path, pathname, response, contentType);
			}
    	}
		//when no errors, data should contain contents of file
		else
		{
			outputHeader(response, contentType, 200);
			response.end(data, 'binary', () => {
				log.info("file delivered: " + pathname);
      		});
		}
	});
}

/*
 * Try opening the given path as a directory. Output listing of files if
 * path is a directory, error 500 if a problem occurs.
 */
function getDir(absolute_path, pathname, response, contentType)
{
	log.warn('directory listing ' + pathname);

	//read the files in the directory
	fs.readdir(absolute_path, (err, files) => {
		if (err)
		{
			outputHeader(res, contentType, 500);
			response.end(errorCodes[500]);
		}
		else
		{
			outputHeader(response, contentType, 200);
			
			/* call to my extension module */
			response.end(ext.getListing(files), 'utf8');
		}
	});
}

/*
 * Output the correct headers depending on type and status. If the
 * contentType is undefined, do not include one in the headers.
 */
function outputHeader(response, type, status)
{
	if (type)
		response.writeHead(status, {"Content-Type": type});
	else
		response.writeHead(status);
}

var port = 8080;
server.listen(port, () => {
	console.log("Listening on " + port);
});
