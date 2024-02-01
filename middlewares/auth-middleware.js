const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { UnauthenticatedError } = require("../errors");

const authenticateuser = async (req, res, next) => {
	// const { authorization } = req.headers;
	// console.log(authorization, req.cookies);

	// if (!authorization || !authorization.startsWith("Bearer ")) {
	// 	throw new UnauthenticatedError("Invalid Token");
	// }
	// const token = authorization.split(" ")[1];

	const token = req.cookies.jwt;
	if (!token) {
		return res.redirect("/");
	}
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		req.user = { ...payload };
	} catch (error) {
		throw new UnauthenticatedError(
			"Authentication Invalid / Session timed out"
		);
	}
	next();
};
const authenticateAdmin = async (req, res, next) => {
	// const { authorization } = req.headers;
	// console.log(authorization, req.cookies);

	// if (!authorization || !authorization.startsWith("Bearer ")) {
	// 	throw new UnauthenticatedError("Invalid Token");
	// }
	// const token = authorization.split(" ")[1];

	const token = req.cookies.adminJWT;
	// console.log(req.cookies.adminJWT);
	if (!token) {
		return res.redirect("/admin/login");
	}
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		req.user = { ...payload };
	} catch (error) {
		throw new UnauthenticatedError(
			"Authentication Invalid / Session timed out"
		);
	}
	next();
};

module.exports = { authenticateuser, authenticateAdmin };
