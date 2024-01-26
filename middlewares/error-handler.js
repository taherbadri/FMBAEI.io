const { StatusCodes } = require("http-status-codes");
const { CustomAPIErrorClass } = require("../errors");
const errorHandlerMiddleware = (err, req, res, next) => {
	const customError = {
		msg:
			err.message ||
			"Oops something went wrong , looks like some kind of problem in our servers ",
		status: err.status || StatusCodes.INTERNAL_SERVER_ERROR,
	};

	// if (err instanceof CustomAPIErrorClass) {
	// 	return res.status(err.status).json({ msg: err.message, type: err.status });
	// }

	if (err.code && err.code === 11000) {
		customError.status = StatusCodes.BAD_REQUEST;
		customError.msg = `Duplicate ${Object.keys(
			err.keyValue
		)} entered, please enter another ${Object.keys(err.keyValue)}`;
	}

	if (err.name === "ValidatorError") {
		customError.msg = Object.values(err.errors)
			.map((item) => item.message)
			.join(", ");
		customError.status = StatusCodes.BAD_REQUEST;
	}

	if (err.name === "CastError") {
		customError.msg = `No item found with id : ${err.value}`;
		customError.status = StatusCodes.NOT_FOUND;
	}
	return res.status(customError.status).json({ msg: customError.msg, err });
};

module.exports = errorHandlerMiddleware;
