const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AdminSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: [4, "Name should be atleast 4 characters long"],
		maxLength: 50,
		required: [true, "Please enter username"],
		unique: true,
	},
	password: {
		type: String,
		required: [true, "Please enter password"],
		minLength: [6, "Password should be atleast minimum 6 characters"],
	},
});

AdminSchema.pre("save", async function () {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

AdminSchema.methods.createJWT = function () {
	return jwt.sign(
		{ adminID: this._id, username: this._name },
		process.env.JWT_SECRET,
		{ expiresIn: "20m" }
	);
};

AdminSchema.methods.comparePassword = async function (pass) {
	const isMatch = await bcrypt.compare(pass, this.password);
	return isMatch;
};

module.exports = mongoose.model("Admin", AdminSchema);
