const { StatusCodes } = require("http-status-codes");
const ThaliFeedback = require("../models/thali");
const {
	BadRequestError,
	NotFoundError,
	UnauthenticatedError,
} = require("../errors");
const User = require("../models/user");
const Attendence = require("../models/attendence");

const getAdminDashboard = (req, res, next) => {
	const user = req.user;
	res.render("admin-homepage", { user });
};

const getAllThali = async (req, res, next) => {
	// const date = new Date().toString().split(" ").splice(0, 4).join(" ");
	// const thali = await Attendence.find({ markedAt: date });
	// console.log(thali[0].markedAt === date);
	// console.log(thali);
	const thali = await User.find({});
	return res.status(200).json({ thali, nbThali: thali.length });
};

const getFullThali = async (req, res) => {
	const date = new Date().toString().split(" ").splice(0, 4).join(" ");
	const thali = await Attendence.find({ thali: "full", markedAt: date });
	return res.status(200).json({ thali, nbThali: thali.length });
};

const getHalfThali = async (req, res) => {
	const date = new Date().toString().split(" ").splice(0, 4).join(" ");
	const thali = await Attendence.find({ thali: "half", markedAt: date });
	return res.status(200).json({ thali, nbThali: thali.length });
};

const DateFilter = async (req, res) => {
	const { date } = req.body;
	// console.log(date);
	if (!date) {
		throw new BadRequestError("Please Enter Date");
	}
	const dateSplit = date.split("-");
	// console.log(
	// 	req.body,
	// 	dateSplit,
	// 	new Date(
	// 		Number(dateSplit[0]),
	// 		Number(dateSplit[1].split("")[1] - 1),
	// 		Number(dateSplit[2]) + 1
	// 	)
	// );
	const data = await Attendence.find({
		markedAt: {
			$gte: new Date(
				Number(dateSplit[0]),
				Number(dateSplit[1].split("")[1] - 1),
				Number(dateSplit[2])
			),
			$lt: new Date(
				Number(dateSplit[0]),
				Number(dateSplit[1].split("")[1] - 1),
				Number(dateSplit[2]) + 1
			),
		},
	});
	// const parsedDate = new Date(date);
	// console.log(req.body, parsedDate);
	// const [{ createdAt }] = await ThaliFeedback.find({});
	// console.log(createdAt.toString().split(' '));
	if (data.length === 0) {
		throw new NotFoundError(`No data in ${date} was found`);
	}
	return res.status(StatusCodes.OK).json({ thali: data });
};

module.exports = {
	getAllThali,
	getAdminDashboard,
	DateFilter,
	getFullThali,
	getHalfThali,
};
