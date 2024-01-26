const CustomAPIErrorClass = require("./custom-api-error");
const { StatusCodes } = require("http-status-codes");
class UnauthenticatedError extends CustomAPIErrorClass {
	constructor(message) {
		super(message);
		this.status = StatusCodes.UNAUTHORIZED;
	}
}

module.exports = UnauthenticatedError;
