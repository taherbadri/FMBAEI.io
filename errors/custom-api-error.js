class CustomAPIErrorClass extends Error {
	constructor(message) {
		super(message);
	}
}

module.exports = CustomAPIErrorClass;
