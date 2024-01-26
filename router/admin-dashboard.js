const express = require("express");
const router = express.Router();

const {
	getAdminDashboard,
	getAllThali,
	DateFilter,
} = require("../controllers/admin-dashboard");

router.route("/dashboard").get(getAdminDashboard);
router.route("/dashboard/thali").get(getAllThali).post(DateFilter);
module.exports = router;
