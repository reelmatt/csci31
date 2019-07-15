# Assignment #3 - ExpressJS, Routing and Templates

The description of this assignment can be found in Canvas at [Assignment #3](https://canvas.harvard.edu/courses/54354/assignments/249112) (Spring 2019)

You should build your application in this repo cloned for you in Github Classroom. You'll submit your project and github URLs in Canvas.  

## My submission

The work for my assignment can be found in the myapp directory. The purpose of the site is to view and log films you have seen, with associated ratings. For starters, there is a list of 5 films you can view, and a form where you can add your own films.

This app makes use of the [OMDB API](http://www.omdbapi.com), and to run on your own, you must [request an API key](http://www.omdbapi.com/apikey.aspx) and store it in a `.env` file as `OMDB=XXXXXXX`. The app makes use of the [.dotenv module](https://www.npmjs.com/package/dotenv) to load this into the application to then authenticate requests to OMDB's servers.