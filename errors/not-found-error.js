const CustomAPIErrorClass = require("./custom-api-error");
const { StatusCodes } = require("http-status-codes");
class NotFoundError extends CustomAPIErrorClass {
	constructor(message) {
		super(message);
		this.status = StatusCodes.NOT_FOUND;
	}
}

module.exports = NotFoundError;
