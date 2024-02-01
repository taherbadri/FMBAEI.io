const Admin = require("../models/admin");
const { StatusCodes } = require("http-status-codes");
const {
	BadRequestError,
	NotFoundError,
	UnauthenticatedError,
} = require("../errors");

const adminRegister = async (req, res, next) => {
	const admin = await Admin.create(req.body);
	return res
		.status(StatusCodes.CREATED)
		.json({ msg: "admin created Successfully" });
};

const adminPage = (req, res, next) => {
	res.render("admin");
};

const adminLogin = async (req, res, next) => {
	const { name, password } = req.body;
	if (!name || !password) {
		throw new BadRequestError("Please enter username and password");
	}
	const admin = await Admin.findOne({ name });
	if (!admin) {
		throw new UnauthenticatedError("Invalid Username");
	}
	const isPasswordCorrect = await admin.comparePassword(password);
	if (!isPasswordCorrect) {
		throw new UnauthenticatedError("Incorrect Password");
	}
	const token = admin.createJWT();

	res.cookie("adminJWT", token, { httpOnly: true, maxAge: 3600000 });
	// res.redirect("/admin/access/dashboard");
	return res.status(StatusCodes.OK).json({ msg: "success" });
};

const adminLogout = (req, res, next) => {
	res.cookie("adminJWT", "", { httpOnly: true, expires: new Date(0) });
	res.redirect("/admin/login");
	// res.status(StatusCodes.OK).json({ msg: "Logged out successfully" });
};

module.exports = {
	adminLogin,
	adminRegister,
	adminPage,
	adminLogout,
};
