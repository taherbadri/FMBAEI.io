const express = require("express");
const {
	scannerPage,
	markAttendence,
} = require("../controllers/scanner-controller");
const router = express.Router();
router.route("/").post(markAttendence);

module.exports = router;
