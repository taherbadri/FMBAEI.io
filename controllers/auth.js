const { StatusCodes } = require("http-status-codes");
const {
	BadRequestError,
	NotFoundError,
	UnauthenticatedError,
} = require("../errors");
const User = require("../models/user");

// const bcrypt = require("bcryptjs");

const register = async (req, res, next) => {
	console.log(req.body);
	const user = await User.create({ ...req.body });
	// return res.status(StatusCodes.CREATED).json({ user });
	return res.redirect("/");
};

const login = async (req, res, next) => {
	const { its, password } = req.body;
	if (!its || !password) {
		throw new BadRequestError("Please enter ITS ID and Password");
	}
	const user = await User.findOne({ its });
	if (!user) {
		throw new UnauthenticatedError("Invalid Credentials");
	}
	const isPasswordCorrect = await user.comparePassword(password);
	if (!isPasswordCorrect) {
		throw new UnauthenticatedError("Invalid Password");
	}
	const token = user.createJWT();
	res.cookie("jwt", token, { httpOnly: true, maxAge: 1200000 });
	res.redirect("/user/dashboard");
	// return res.status(StatusCodes.OK).json({ msg: "success", token });
};

const loginPage = (req, res, next) => {
	res.render("index");
};
const registerPage = (req, res, next) => {
	res.render("register");
};

const logout = (req, res, next) => {
	res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
	res.status(StatusCodes.OK).json({ msg: "logged out successfully" });
};

module.exports = {
	login,
	register,
	loginPage,
	registerPage,
	logout,
};
