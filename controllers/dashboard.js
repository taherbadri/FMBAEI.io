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
	// console.log(user);
	res.render("homepage", { user });
};

const createFeedback = async (req, res, next) => {
	const { userID, username } = req.user;
	req.body.createdBy = userID;
	req.body.createdAt = new Date(
		new Date().getFullYear(),
		new Date().getMonth(),
		Number(new Date().getDate()).toString()
	);
	req.body.name = username;
	// console.log(req.body);
	if (await ThaliFeedback.findOne({ createdBy: userID })) {
		const { createdAt } = await ThaliFeedback.findOne({ createdBy: userID });
		const dateString = createdAt.toString().split(" ").splice(0, 4).join(" ");
		// console.log(
		// 	dateString,
		// 	new Date().toString().split(" ").splice(0, 4).join(" ")
		// );
		if (
			dateString === new Date().toString().split(" ").splice(0, 4).join(" ")
		) {
			throw new BadRequestError("Feedback already recieved for today");
		}
	}
	const feedback = await ThaliFeedback.create(req.body);
	res
		.status(StatusCodes.CREATED)
		.json({ feedback, msg: "Feedback sent Successfully" });
};

module.exports = {
	getdashboard,
	createFeedback,
};
