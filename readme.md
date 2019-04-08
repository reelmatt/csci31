# Assignment #5 - REST APIs

The description of this assignment can be found in Canvas at [Assignment #5](https://canvas.harvard.edu/courses/54354/assignments/249114) (Spring 2019)

You should build your application in this repo cloned for you in Github Classroom. You'll submit your project and github URLs in Canvas.


---

## My submission

This assignment focuses on the REST API to access information about films from the database. The API handles all four CRUD operations and is demonstrated with a test page that outputs test logs via client-side Javascript. The web-app was changed to support the FilmService API, but should retain the same functionality. For information about authorization/authentication, please [reference the README from assignment 4](https://github.com/HarvardDCENode/assignment-4-reelmatt/blob/master/readme.md).

Instructions for how to run the API test can be found on the page where you run them:
[API Test](http://167.99.149.212:8080/api-test.html).

The purpose of the site is to view and log films you have seen, with associated ratings. 
This app makes use of the [OMDB API](http://www.omdbapi.com), and to run on your own, you must [request an API key](http://www.omdbapi.com/apikey.aspx) and store it in a `.env` file as `OMDB=XXXXXXX`.

The app implements rudimentary user authorization/authentication. Usernames and passwords
are stored in plain text in the database (obviously a security concern and one that
would need to be improved in a "real" application). If not logged in, the user can view
the home page, about page, and the login/registration pages. After registration/login,
a user can log films, view films in their diary, edit the rating they have assigned to
the film, and delete the film from their diary.

A test user, with some sample films exists in the database. The credentials for the test
user are:
	username: testuser01
	password: abcd1234

A future improvement this app could make is to reduce duplicates and validate
information provided for a film. Another future improvement would be to investigate
storing each film once in the database, and keep track of the users that have logged it
(rather than logging a separate "film" for each user).