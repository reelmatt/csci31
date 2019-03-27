const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	name: {type: String, required:true},
	rating: Number,
	poster: String,
	imdbId: String,
	plot: String,
	mpaa: String,
	cast: String,
	runtime: String,
	year: String,
	user: String,
	createdAt: Date,
	updatedAt: Date
});

/* When saving to the database, add a created time. For each subsequent
 * update, save an updated time.
 */
schema.pre('save', function(next) {
	if(!this.createdAt)
		this.createdAt = new Date();
	else
		this.updateAt = new Date();

	next();
});

module.exports = mongoose.model("Film", schema);