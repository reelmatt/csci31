# Assignment #4 - Express Routing, MongoDB, and Mongoose

The description of this assignment can be found in Canvas at [Assignment #4](https://canvas.harvard.edu/courses/54354/assignments/249113) (Spring 2019)

You should build your application in this repo cloned for you in Github Classroom. You'll submit your project and github URLs in Canvas.

---

## My submission

The purpose of the site is to view and log films you have seen, with associated ratings. 
This app makes use of the [OMDB API](http://www.omdbapi.com), and to run on your own, you must [request an API key](http://www.omdbapi.com/apikey.aspx) and store it in a `.env` file as `OMDB=XXXXXXX`.

The app implements rudimentary user authorization/authentication. Usernames and passwords
are stored in plain text in the database (obviously a security concern and one that
would need to be improved in a "real" application). If not logged in, the user can view
the home page, about page, and the login/registration pages. After registration/login,
a user can log films, view films in their diary, edit the rating they have assigned to
the film, and delete the film from their diary.

A future improvement this app could make is to reduce duplicates and validate
information provided for a film. Another future improvement would be to investigate
storing each film once in the database, and keep track of the users that have logged it
(rather than logging a separate "film" for each user).