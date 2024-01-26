const express = require("express");
const router = express.Router();

const {
	adminLogin,
	adminPage,
	adminRegister,
	adminLogout,
} = require("../controllers/admin");

router.route("/login").get(adminPage).post(adminLogin);
router.post("/logout", adminLogout);
router.post("/register", adminRegister);

module.exports = router;
