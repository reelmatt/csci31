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

	// Create an absolute path to the requested file. Assume server started from htdocs.
	const absolute_path = path.join(__dirname, 'htdocs', pathname);
	log.debug('absolute_path is ' + absolute_path);

	fs.readFile(absolute_path, (err, data) => {
		//check error cases first
		if (err)
		{
			log.error(err);

			if (err.code == 'ENOENT')			//file doesn't exist
			{
				//log the offending file, and return a 404 page
				log.warn('404 error getting ' + pathname);
				outputHeaders(res, contentType, 404);
			}
			else if (err.code == 'EISDIR')		//is dir, create dir listing
			{
				log.warn('directory listing ' + pathname);

				fs.readdir(absolute_path, (err, files)=>{
					if (err)
					{
						outputHeaders(res, contentType, 500);
					}
					else
					{
						//get a listing of formatted links for each file in the dir
						var s = ext.getListing(pathname, files);
						
						//display that listing
						deliverContent(res, contentType, s, 'utf8', null);
					}
				});
			}
		}
		// If we get to here, 'data' should contain the contents of the file
		else
		{
			deliverContent(res, contentType, data, 'binary', pathname);
		}
	});
});


/*
 * When meeting criteria for a 200 response code, output a correct header
 * and format the content of the page appropriately. Calls on outputHeader()
 * and factors out response.end() code.
 *
 * This function keeps the assignment's original logging of the "file delivered"
 * message.
 */
function deliverContent(response, contentType, data, encoding, path)
{
	outputHeaders(response, contentType, 200);		//output the correct header
	
	if (encoding === 'binary')						//aka, found a file to deliver
	{
		response.end(data, encoding, () =>{
			log.info("file delivered: " + path);	//log the name of it
		});
	}
	else
	{
		response.end(data, encoding);				//otherwise, just output data
	}
}

/*
 * Output the correct headers depending on type and status. If the
 * contentType is undefined, do not include one in the headers.
 *
 * For status codes that have an error message, also write the end
 * to the response, and included the defined error message. See the
 * defined errorCodes array at the head of this file.
 */
function outputHeaders(response, type, status)
{
	if (type)
		response.writeHead(status, {"Content-Type": type});
	else
		response.writeHead(status);
	
	//for error conditions, also output the response.end()
	if (status === 404 || status === 500)
		response.end(errorCodes[status]);
}

var port = 8080;
server.listen(port, () => {
	console.log("Listening on " + port);
});
