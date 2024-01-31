const User = require("../models/user");
const Attendence = require("../models/attendence");
const errors = require("../errors");
const { StatusCodes } = require("http-status-codes");

const markAttendence = async (req, res) => {
	const { id } = req.body;
	const [{ sabeel, name }] = await User.find({ _id: id });
	if (!name) {
		throw new errors.BadRequestError("User does not exist");
	}
	const attendence = await Attendence.find({ sabeel });
	if (attendence.length !== 0) {
		throw new errors.BadRequestError(`${name} Attendence marked for today`);
	}
	await Attendence.create({ sabeel, markedAt: new Date() });
	res.status(StatusCodes.OK).json({ msg: "Attendence marked successfully" });
};

const scannerPage = (req, res) => {
	res.render("scanner");
};

module.exports = { markAttendence, scannerPage };
