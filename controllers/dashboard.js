const { StatusCodes } = require("http-status-codes");
const ThaliFeedback = require("../models/thali");
const {
	BadRequestError,
	NotFoundError,
	UnauthenticatedError,
} = require("../errors");
const User = require("../models/user");

const getdashboard = (req, res, next) => {
	// console.log("cookies ", req.cookies);
	const user = req.user;
	console.log(user);
	res.render("homepage", { user });
};

const createFeedback = async (req, res, next) => {
	const { userID, username } = req.user;
	req.body.createdBy = userID;
	req.body.name = username;
	console.log(req.body);
	const feedback = await ThaliFeedback.create(req.body);
	res
		.status(StatusCodes.CREATED)
		.json({ feedback, msg: "Feedback sent Successfully" });
};

module.exports = {
	getdashboard,
	createFeedback,
};
