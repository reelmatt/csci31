# csci31-grad-assignment

One thing you will probably come across early on in your NodeJS experience is
the asynchronous nature of code and requests. As someone who's previous
experience came mainly with "straightforward", do these instructions in this
order, programming, this was perhaps the most difficult aspect to understand
with NodeJS.

As in pretty much any programming language, there are multiple solutions to the
same problem. NodeJS is constantly developing and gaining new language features
like Promises and async/await to deal with the asynchronous problem I ran into
early on.

For this problem set, the goal is to re-write the code provided to correctly
handle the asynchronous nature of an HTTP request. As written, the form will
start the HTTP request, log the result as "undefined" (since the request is,
or could, still be in progress), and incorrectly send this "undefined" result
to the rendered webpage.

To solve this problem, there are at least two solutions: callbacks and Promises.
Your task is to use one of these methods and modify the existing code to
correctly start, receive, and render a request for a Vimeo video using their
oEmbed API. The basics are already in place; an index page to submit a URL to
a Vimeo video, and a result page that will display some basic information about
the video.

Behind the scenes, in the index.js router file, there is a getVimeo() function
which takes the URL from the form and starts an HTTP request which will return
JSON data, and do some basic error checking to ensure it is valid.

Follow the comments to see how the current code functions, and then use that
to create a synchronous version that will only load the resulting "info" page
when the request to Vimeo is finished. (Hint: most of the code changes will
actually take place in the router.get() part of the file that deals with
displaying the page.)

---

**Goal:** Rewrite the provided code to correctly fetch and output information from
an HTTP request.

**Steps:**

1. Clone this repository to your machine.
2. Run `npm install` to download the necessary packages.
3. Run `npm start` to start the app and visit http://localhost:3000 to see
how it works.
4. Edit the code in `index.js` so that when you enter a valid Vimeo URL (like
the example on the page), the form disappears and you see the title duration,
and description of the video you submitted.

Good luck!

---

**Solutions:**
As a part of *my* assignment requirements, the solutions are
provided in the same repository, in the `index-solutions.js` file in the
`routes/` directory. The solutions file contains solutions for a method using
callbacks and one using promises. To use the solutions, comment out the line
noted in `app.js` and replace it with the following code:

`var indexRouter = require('./routes/index-solutions');`

Just doing this should make the app functional. The default method is the one
using callbacks. To use the method with promises, swap the /* */ comment block
to use the alternate function.

---

## References:
[Documentation for callbacks](https://developer.mozilla.org/en-US/docs/Mozilla/js-ctypes/Using_js-ctypes/Declaring_and_Using_Callbacks)

[Documentation for Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
