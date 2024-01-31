const User = require("../models/user");
const Attendence = require("../models/attendence");
const errors = require("../errors");
const { StatusCodes } = require("http-status-codes");

const markAttendence = async (req, res) => {
	const { id } = req.body;
	const [{ sabeel, name, its, thali, thaliNumber }] = await User.find({
		_id: id,
	});
	if (!name) {
		throw new errors.BadRequestError("User does not exist");
	}
	const date = new Date().toString().split(" ").splice(0, 4).join(" ");

	const attendence = await Attendence.find({ markedAt: date });
	if (attendence.length !== 0) {
		attendence.forEach((user) => {
			if (user.sabeel === sabeel) {
				throw new errors.BadRequestError(
					`${name} Attendence already marked for today`
				);
			}
		});
	}
	await Attendence.create({
		sabeel,
		name,
		its,
		thali,
		thaliNumber,
		markedAt: date,
	});

	res.status(StatusCodes.OK).json({ msg: "Attendence marked successfully" });
};

module.exports = { markAttendence };
