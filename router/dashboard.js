const express = require("express");
const router = express.Router();

const { createFeedback, getdashboard } = require("../controllers/dashboard");

router.route("/dashboard").get(getdashboard).post(createFeedback);

module.exports = router;
