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
 *	Note: Because HTTP requests are asynchronous, the call to getVimeo()
 *		  will finish after you check whether 'video' exists or not. As
 *		  such, this view will always call the 'else' clause and redirect
 *		  back to the homepage to try again.
 *  Note: How would you change the call to getVimeo() to only render/redirect
 *		  on the success/failure of the HTTP request. (Hint: try adding a
 *		  callback to getVimeo(), or having it return a Promise.)
 *	@@TO-DO: Most of the changes to the code will take place here. Think about
 *			 *when* you would get a response from getVimeo(), *what* that response
 *			 might look like, and the order in which you would handle it. For both
 *			 callbacks and Promises, you can think of them as saying, "When I'm done
 *			 doing something, I will tell you and you can proceed." As is currently
 *			 written, the code might be saying, "Get me the video info, and before
 *			 you have a change to start, can you tell me what it is?"
 */
router.get('/info', (req, res, next) => {
	// Call getVimeo() to start the HTTP request to the Query URL
	// @@TO-DO: Will you want to store the result of getVimeo() in a variable?
	// If not, how do you handle the result that is returned?
	let video = getVimeo(req.query.url);
	
	// Check the results -- are they what you expect?
	console.log("The response from getVimeo() is...");
	console.log(video);
	
	// If the request was successful
	if (video)
	{
		console.log("Got the video!");
		console.log(video);
		
		// Pass it through and display the result
		res.render('info', {
			title: 'Vimeo Getter',
			video: video
		});
	}
	// The request had an error. Display message and redirect back to Home.
	else 
	{
		console.log("Error getting the video. Try again.");
		res.redirect('/');
	}
})

/*
 *	getVimeo()
 *	Purpose: Retrieve JSON-formatted data for a video on Vimeo
 *	  Input: video, URL to a video on Vimeo
 *			 (e.g. "https://vimeo.com/265045525")
 *	 Return: The video information (in JSON), or error message
 *	   Note: Pay attention to the order in which these steps happen.
 *			 Do the log and return statements occur when you expect? How
 *			 can you re-write them to function correctly? Also look to the
 *			 router.get() view above.
 *	@@TO-DO: To change this function to accept callbacks or Promises, look
 *			 carefully at the return statements. For the callback solution,
 *			 3 lines will change; for the Promises solution the same 3 will
 *			 change and you'll need to add 1 to setup a promise.
 * Reference: See the README.md file for links to the documentation for Callbacks
 *			  and Promises at MDN.
 */
function getVimeo(video)
{
	// Construct the full URL to fetch
	let base = "https://vimeo.com/api/oembed.json?url=";
	let url = base + video;
	console.log("url is... " + url);

	// Fetch the HTTP response
	// @@HINT: If making a Promise, add a new line here
	https.get(url, (res) => {
		
		// Check for errors fetching the URL
		if (res.statusCode != 200)
		{
			return ("Error fetching the page at: " + url);	//<-- how would this change?
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
				if ( json.domain_status_code ) {
					return "Error fetching video info.";	//<-- how would this change?
				} else {
					return json; // <-- how would this change?
				}
			});
		}	
	});
}

 module.exports = router;