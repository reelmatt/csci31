// wrap in IIFE to control scope
(function(){

	const baseURL = 'http://localhost:8080';
	
	function logResult(method, result)
	{
		console.log('\n\n***************************\n' + method + ':');
		console.log(result);
	}

	function getFilm()
	{
		let film =  {
			title: document.getElementById("title").value,
			rating: document.getElementById("rating").value
		};
		
// 		console.log("new film from form is " + film.title);
		return film;
	}
	
	function testAPIs()
	{
		// list
		callAPI('GET', '/api/films', null)
		.then((list) => {logResult("list results", list); })
		
		// add a film from form data
		.then(() => {return callAPI('POST', '/api/films', getFilm());})
		.then((film) => {logResult("test results", film); filmId = film._id;})
		
		// find
		.then(() => {return callAPI('GET', '/api/films/'+filmId, null);})
		.then((film) => {logResult("find results", film);})
	
		// update rating to 5
		.then(() => {return callAPI('PUT', '/api/films/'+filmId, {rating: 5});})
		.then((film) => {logResult("update results", film);})
		
		// delete
		.then(() => {return callAPI('DELETE', '/api/films/'+filmId, null);})
		.then((result) => {logResult("delete result", result);})

		// any errors?
		/*
		
			// add a film from form data
			callAPI('POST', '/api/films', postData)
			.then((film)=>{
				logResult("create results", film);

				filmId = film._id;

				// find
				callAPI('GET','/api/films/'+filmId, null)
				.then((film)=>{
					logResult("find results", film);

					// update rating to 5
					callAPI('PUT','/api/films/'+filmId, {rating: 5})
					.then((film)=>{
						logResult("update results", film);

						// delete
						callAPI('DELETE', '/api/films/'+filmId, null)
						.then((result)=>{
							logResult("delete result", result);
						 })
					});
				});
			})
			.catch((err) => {
				console.log("failed the POST API. Here's the error: " + err);
			});
		})*/
		.catch((err)=>{
		  console.error(err);
		});
	}

	

	async function callAPI(method, uri, body)
	{
		jsonMimeType = {
		  'Content-type':'application/json'
		}
		try{
		  /*  Set up our fetch.
		   *   'body' to be included only when method is POST
		   *   If 'PUT', we need to be sure the mimetype is set to json
		   *      (so bodyparser.json() will deal with it) and the body
		   *      will need to be stringified.
		   *   '...' syntax is the ES6 spread operator.
		   *      It assigns new properties to an object, and in this case
		   *      lets us use a conditional to create, or not create, a property
		   *      on the object. (an empty 'body' property will cause an error
		   *      on a GET request!)
		   */
	  
		  var response = await fetch(baseURL + uri, {
			method: method, // GET, POST, PUT, DELETE, etc.
			...(method=='POST' ? {headers: jsonMimeType, body:JSON.stringify(body)} : {}),
			...(method=='PUT' ?  {headers: jsonMimeType, body:JSON.stringify(body)} : {})
		  });
		  return response.json(); // parses response to JSON
		}catch(err){
		  console.error(err);
		  return "{'status':'error'}";
		}
	}

	// Calls our test function when we click the button
	//  afer validating that there's a file selected.
	document.querySelector('#testme').addEventListener("click", ()=>{
		testAPIs();
	});
})();