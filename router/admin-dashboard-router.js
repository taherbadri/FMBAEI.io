const express = require("express");
const router = express.Router();

const {
	getAdminDashboard,
	getAllThali,
	DateFilter,
	getFullThali,
	getHalfThali,
} = require("../controllers/admin-dashboard-controller");

router.route("/dashboard").get(getAdminDashboard);
router.route("/dashboard/thali").get(getAllThali).post(DateFilter);
router.route("/dashboard/thali/full").get(getFullThali);
router.route("/dashboard/thali/half").get(getHalfThali);
module.exports = router;
