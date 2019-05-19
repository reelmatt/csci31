## Grading Notes

Very nice work, Matthew. Just a few notes for you consider:

### Asynchronous behavior

This is subtle, but it's worth noting. When your Angular filmdetail component first renders, the film record may not yet have arrived from the API call, resulting in an error trace popping up in the client log. Eventually the record does return and the user experience is fine, but if you want to prevent the log from reporting these transient errors, you can wrap the markup rendering the details record in an *ngIf guard. I've made this change to **film.component.html** and committed it to your repo.

### Error handling

Although your server component correctly responds with an error when the user submits a title that can't be matched in the films database, the UI leaves the user hanging as to what might have happened. I've modified your **newfilmcomponent** to add an error-handling block to the subscribe method and a crude error display element to the html by way of illustration.

### Angular routing through Express

The trick to getting your Express to handle routing to Angular and allowing your users to bookmark and return directly to their favorite films in your app is to add this bit of middleware to the configuration in `app.js`:

```javascript
app.get("/*", (req, res) => {
	res.sendFile("index.html", {
		root: "../client/dist/FilmLogger-Angular"
	});
});
```

This instructs Express to hand any route it can't recognize to the client app for parsing. Of course, this is also puts the burden of handling all unresolvable routes as 404 errors in the client code, rather than Express. I've updated your app.js with this additional configuration; I leave the 404 handling to you as an exercise.
