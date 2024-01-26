const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
	its: {
		type: String,
		required: [true, "Please provide ITS ID"],
		maxLength: 8,
		unique: true,
	},
	password: {
		type: String,
		required: [true, "Please Enter Password"],
		minLength: [5, "Password should be atleast 5 characters long"],
	},
	thali: {
		type: String,
		default: "full",
	},
	thaliNumber: {
		type: String,
		required: [true, "Enter Thali number"],
		unique: true,
	},
	sabeel: {
		type: String,
		minLength: 4,
		required: [true, "Please provide your Sabeel Number"],
		unique: true,
	},
	name: {
		type: String,
		required: [true, "Please Enter you full name"],
		minLength: 5,
		maxLength: 30,
	},
	comment: {
		type: String,
		maxLength: [500, "Maximum 500 characters allowed"],
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
