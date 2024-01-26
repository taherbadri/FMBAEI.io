const { StatusCodes } = require("http-status-codes");

const notFound = (req, res, next) => {
	return res
		.status(StatusCodes.NOT_FOUND)
		.send(
			`<h1>${StatusCodes.NOT_FOUND}</h1><h3>The route you requested ${req.path} does not exists</h3>`
		);
};

module.exports = notFound;
