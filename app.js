require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const helmet = require("helmet");
// const xss = require("xss-clean");
// const rateLimiter = require("express-rate-limit");

const connectDB = require("./db/connect");
const {
	authenticateuser,
	authenticateAdmin,
} = require("./middlewares/auth-middleware");

const auth = require("./router/auth");
const adminAuth = require("./router/admin");
const dashboard = require("./router/dashboard");
const adminDashboard = require("./router/admin-dashboard");

const notFound = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");

// security packages  -----
// app.set("trust proxy", 1);
// app.use(
// 	rateLimiter({
// 		windowMs: 15 * 60 * 1000,
// 		max: 100,
// 	})
// );
// app.use(express.json());
// app.use(helmet());
// app.use(cors());
// app.use(xss());
//  ----- security packages

app.use(
	express.urlencoded({
		extended: false,
	})
);
app.use(express.json());
app.use(cookieParser());

app.set("view engine", "ejs");
app.use(express.static("./public"));
app.use("/", auth);
app.use("/admin", adminAuth);
app.use("/user", authenticateuser, dashboard);
app.use("/admin/access", authenticateAdmin, adminDashboard);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		console.log("db connected");
		app.listen(port, console.log(`server listening on port ${port}...`));
	} catch (error) {
		console.log(error);
	}
};

start();
