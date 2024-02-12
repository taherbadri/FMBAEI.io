const mongoose = require("mongoose");

const AttendenceSchema = new mongoose.Schema({
	sabeel: {
		type: String,
		required: [true, "Please provide Sabeel number"],
	},
	its: {
		type: String,
		required: [true, "Please provide ITS ID"],
		maxLength: 8,
	},
	thali: {
		type: String,
		default: "full",
	},
	thaliNumber: {
		type: String,
		required: [true, "Enter Thali number"],
	},
	sabeel: {
		type: String,
		minLength: 4,
		required: [true, "Please provide your Sabeel Number"],
	},
	name: {
		type: String,
		required: [true, "Please Enter you full name"],
		minLength: 5,
	},
	markedAt: {
		type: Date,
	},
	comment: {
		type: String,
		maxLength: [500, "Maximum limit is 500 characters"],
	},
});

module.exports = mongoose.model("Attendence", AttendenceSchema);
