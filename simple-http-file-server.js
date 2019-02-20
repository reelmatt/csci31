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
	/* except for logging the query values, I use the 3rd-party log module*/
	log.debug(req.url);

	const parsedUrl = url.parse(req.url, true);	//parse URL to component parts
	log.debug(parsedUrl);						//log that object
	log.debug('__dirname is %s', __dirname);	//output absolute path info
	log.debug('cwd is %s', process.cwd());

	const { pathname, query } = parsedUrl;		//extract pathname & query properties

	// calls to my extension module
	var contentType = ext.getType(pathname);	//set mimetype (undefined if not known)
	ext.logQuery(query);						//log the query key:value pairs

	// Create an absolute path to the requested file. Assume server started from root.
	const absolute_path = path.join(__dirname, pathname);
	log.debug('absolute_path is ' + absolute_path);

	fs.readFile(absolute_path, (err, data) => {
		//check error cases first
		if (err)
		{
			log.error(err);

			if (err.code == 'ENOENT')			//file doesn't exist, return 404
			{
				log.warn('404 error getting ' + pathname);

				//outputHeader(res, contentType, 404);	//not working
				res.writeHead(404, contentType);		//works, but might be undefined

				res.end('404: Page Not Found!');
			}
			else if (err.code == 'EISDIR')		//is dir, create dir listing
			{
				log.warn('directory listing ' + pathname);

				fs.readdir(absolute_path, (err, files)=>{
					if (err)
					{
						//outputHeader(res, contentType, 500);	//not working
						res.writeHead(500, contentType);		//works, might be undef
						res.end('Server Error 500');
					}

					//let s = ext.getListing(files);			//outputs as plain text

					let s = '<b>Directory Listing</b><br>';		//this outputs as HTML
					files.forEach((i)=>{
						s += ("<a href=\"" + i + "\">" + i + "</a><br>");
					});

					//outputHeader(res, contentType, 200);		//not working
					res.writeHead(200, contentType);			//works, might be undef
					res.end(s, 'utf8');
				});
			}
		}
		// If we get to here, 'data' should contain the contents of the file
		else
		{
			//outputHeader(res, contentType, 200);				//not working
			res.writeHead(200, contentType);					//works, might be undef
			res.end(data, 'binary', ()=>{
				log.info("file delivered: " + pathname);
			});
		}
	});
});

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
