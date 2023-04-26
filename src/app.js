import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import initRouterV1 from "./v1/routes/index.router";
import { connect } from "./v1/config/database.config";
import createError from "http-errors";
import cookieParser from "cookie-parser";

// env
dotenv.config();
const app = express();
const port = process.env.PORT || 5000


// connection db
connect();

// use middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// router
initRouterV1(app);

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
