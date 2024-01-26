const CustomAPIErrorClass = require("./custom-api-error");
const { StatusCodes } = require("http-status-codes");
class BadRequestError extends CustomAPIErrorClass {
	constructor(message) {
		super(message);
		this.status = StatusCodes.BAD_REQUEST;
	}
}

module.exports = BadRequestError;
