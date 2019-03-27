const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
	user: {type: String, required: true},
	email: String,
	password: {type: String, required: true},
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

module.exports = mongoose.model("User", schema);