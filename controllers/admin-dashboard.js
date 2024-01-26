const { StatusCodes } = require("http-status-codes");
const ThaliFeedback = require("../models/thali");
const {
	BadRequestError,
	NotFoundError,
	UnauthenticatedError,
} = require("../errors");
const User = require("../models/user");

const getAdminDashboard = (req, res, next) => {
	const user = req.user;
	res.render("admin-homepage", { user });
};

const getAllThali = async (req, res, next) => {
	const thali = await ThaliFeedback.find({});
	return res.status(200).json({ thali, nbThali: thali.length });
};

module.exports = { getAllThali, getAdminDashboard };
