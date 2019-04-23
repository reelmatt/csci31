var express = require('express');
var router = express.Router();
var https = require('https');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
  	title: 'Vimeo Getter'
  });
});

/* 
 *	Display the info from the Vimeo video requested
 *	Note: This solution includes code for both the callback and Promise
 *		  methods. To see both function, and any differences between them,
 *		  comment/un-comment them to run one at a time.
 */
router.get('/info', (req, res, next) => {

	// callback method
	console.log("Callback method...");
	let callback = getVimeoCallback(req.query.url, (err, video) => {
		// In getVimeo(), when an error occurs the callback sends
		// (err, null) in the function. 
		if(err)
		{
			console.log("Error with video.");
			res.redirect('/');
		}
		// When successful, the opposite is true. The callback contains
		// (null, info) to indicate no error and include the results.
		else
		{
			console.log("Got the video!");
			console.log(video);
			res.render('info', {
				title: 'Vimeo Getter',
				video: video
			});
		}
	});	
	
	console.log("The value of 'callback' is:");
	console.log(callback);

/*
	// Promise method
	console.log("Promise method...");
	let promise = getVimeoPromise(req.query.url)
		.then((video) => {
			console.log("Got the video!");
			console.log(video);
			res.render('info', {
				title: 'Vimeo Getter',
				video: video
			});
		})
		.catch((err) => {
			console.log("Error with video.");
			console.log(err);
			res.redirect('/');
		});
	
	console.log("The value of 'promise' is:");
	console.log(promise);
	console.log("Note: this is shown *before* the request finishes, despite " + 
				"appearing later in the code.");
*/
})


/*
 *	getVimeoCallback()
 *	Purpose: Retrieve JSON-formatted data for a video on Vimeo
 *	  Input: video, URL to a video on Vimeo
 *			 (e.g. "https://vimeo.com/265045525")
 *			 callback, function to return the result or an error message
 *	 Return: The callback function with result or error
 */
function getVimeoCallback(video, callback)
{
	// Construct the full URL to fetch
	let base = "https://vimeo.com/api/oembed.json?url=";
	let url = base + video;
	console.log("url is... " + url);

	// Fetch the HTTP response
	https.get(url, (res) => {

		// Check for errors fetching the URL
		if (res.statusCode != 200)
		{
			callback("Error fetching the page at: " + url);
		}
		// No errors, so far, store the response
		else 
		{
			res.setEncoding('utf8');
			let responseData = "";
			
			res.on('data', (chunk) => {
				responseData += chunk;
			});
			
			// The request has finished
			res.on('end', () => {
				// Parse the results and log it
				var json = JSON.parse(responseData);
				console.log(json);

				// Check if the response has a problem
				// Note: this can happen when a video is set to "Private"
				if ( json.domain_status_code )
				{
					callback("Error fetching video information.", null);
				}
				else
				{
					callback(null, json);
				}
			});
		}	
	});
}

/*
 *	getVimeoPromise()
 *	Purpose: Retrieve JSON-formatted data for a video on Vimeo
 *	  Input: video, URL to a video on Vimeo
 *			 (e.g. "https://vimeo.com/265045525")
 *	 Return: A Promise that the HTTP request will succeed or fail
 */
function getVimeoPromise(video)
{
	// Construct the full URL to fetch
	let base = "https://vimeo.com/api/oembed.json?url=";
	let url = base + video;
	console.log("url is... " + url);

	// Return a Promise that the request will succeed (resolve) or fail (reject)
	return new Promise( (resolve, reject) => {
		
		// Fetch the HTTP response
		https.get(url, (res) => {
			// Check for errors fetching the URL
			if (res.statusCode != 200)
			{
				return reject("Error fetching the page at: " + url);
			}
			// No errors so far, store the response
			else
			{
				res.setEncoding('utf8');
				let responseData = "";
			
				res.on('data', (chunk) => {
					responseData += chunk;
				});
			
				// The request has finished
				res.on('end', () => {
					// Parse the results and log it
					var json = JSON.parse(responseData);
					console.log(json);
				
					// Check if the response has a problem
					// Note: this can happen when a video is set to "Private"
					if ( json.domain_status_code )
					{
						return reject("Error fetching video information.");
					}
					else
					{
						return resolve(json);
					}
				});
			}	
		})
	})
}

 module.exports = router;