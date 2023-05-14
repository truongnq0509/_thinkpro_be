import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import initRouterV1 from "./v1/routes/index.router";
import { connect } from "./v1/config/database.config";
// import initRouterV2 from "./v2/routes/index.router";
// import { connect } from "./v2/config/database.config";
import createError from "http-errors";
import cookieParser from "cookie-parser";

// env
dotenv.config();
const app = express();
const port = process.env.PORT || 5000


// connection db
connect();

// use middleware
app.use(cors({
	credentials: true,
	origin: process.env.FE_URL
}));
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// router
initRouterV1(app);
// initRouterV2(app)

// error handler middleware
app.use((req, res, next) => {
	next(createError.NotFound("not found!"));
});

app.use((err, req, res, next) => {
	res.status(err.status || 500).json({
		error: {
			status: err.status || 500,
			message: err.message || "internal server",
		},
	});
});

app.listen(port, () => {
	console.log(`http://localhost:${port}`)
})
