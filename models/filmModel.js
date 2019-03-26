const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
	name: {type: String, required:true},
	rating: Number,
	poster: String,
	createdAt: Date,
	updatedAt: Date
});

schema.pre('save', function(next) {
	if(!this.createdAt)
		this.createdAt = new Date();
	else
		this.updateAt = new Date();
	
	next();
});

module.exports = mongoose.model("Film", schema);