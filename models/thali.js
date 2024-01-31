const mongoose = require("mongoose");

const ThaliSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Username not provided"],
	},
	thaliNumber: {
		type: String,
		required: [true, "Thali number not provided"],
	},
	thali: {
		type: String,
		enum: ["full", "half", "no-thali"],
		required: [true, "Specify the quantity Full / Half"],
	},
	sabeel: {
		type: String,
		required: [true, "Sabeel number not provided"],
	},
	comment: {
		type: String,
		maxLength: [500, "Maximum limit is 500 characters"],
	},
	createdBy: {
		type: mongoose.Types.ObjectId,
		required: [true, "please provide end user"],
		ref: "User",
	},
	createdAt: {
		type: Date,
		required: true,
	},
});

module.exports = mongoose.model("Thali-Feedback", ThaliSchema);
