const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please Enter you full name"],
		minLength: 5,
	},
	sabeel: {
		type: String,
		required: [true, "Please provide your Sabeel Number"],
		unique: true,
	},
	thaliNumber: {
		type: String,
		required: [true, "Enter Thali number"],
		unique: true,
		default: "NA",
	},
	its: {
		type: String,
		required: [true, "Please provide ITS ID"],
		maxLength: 8,
		unique: true,
	},
	members: {
		type: String,
		default: "0",
	},
	password: {
		type: String,
		required: [true, "Please Enter Password"],
		minLength: [5, "Password should be atleast 5 characters long"],
	},
	mobile: {
		type: String,
	},
	thali: {
		type: String,
		default: "full",
	},

	address: {
		type: String,
		maxLength: [500, "Maximum 500 characters allowed"],
	},
	type: {
		type: String,
	},
	sector: {
		type: String,
	},
	jamaat: {
		type: String,
	},
	jamiat: {
		type: String,
	},
	city: {
		type: String,
	},
	state: {
		type: String,
	},
	country: {
		type: String,
	},
});

UserSchema.pre("save", async function () {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
	return jwt.sign(
		{
			userID: this._id,
			ITSID: this.its,
			username: this.name,
			thaliNumber: this.thaliNumber,
			sabeel: this.sabeel,
			thaliType: this.thali,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: "20m",
		}
	);
};

UserSchema.methods.comparePassword = async function (pass) {
	const isMatch = await bcrypt.compare(pass, this.password);
	return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
