const express = require("express");
const router = express.Router();

const {
	logout,
	login,
	register,
	loginPage,
	registerPage,
} = require("../controllers/auth");

router.route("/").get(loginPage);
router.route("/register").get(registerPage);
router.post("/user/login", login);
router.post("/user/logout", logout);
router.post("/user/register", register);

module.exports = router;
