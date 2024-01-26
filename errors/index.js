const CustomAPIErrorClass = require("./custom-api-error");
const BadRequestError = require("./bad-request");
const NotFoundError = require("./not-found-error");
const UnauthenticatedError = require("./unauthenticated");

module.exports = {
	BadRequestError,
	CustomAPIErrorClass,
	NotFoundError,
	UnauthenticatedError,
};
