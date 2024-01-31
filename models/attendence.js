const mongoose = require("mongoose");

const AttendenceSchema = new mongoose.Schema({
	sabeel: {
		type: String,
		required: [true, "Please provide Sabeel number"],
	},
	markedAt: {
		type: Date,
	},
});

module.exports = mongoose.model("Attendence", AttendenceSchema);
