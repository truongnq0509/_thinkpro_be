import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import createError from "http-errors";

dotenv.config();

export function signAccessToken(data) {
	const payload = data;
	const options = {
		expiresIn: "2h",
	};
	const token = jwt.sign(payload, process.env.JWT_SECRET_ACCESS_TOKEN, options);
	return token;
}

export function signRefreshToken(data) {
	const payload = data;
	const options = {
		expiresIn: "365d",
	};
	const token = jwt.sign(payload, process.env.JWT_SECRT_REFRESH_TOKEN, options);
	return token;
}

export function verifyAccessToken(req, res, next) {
	const accessToken = req.headers?.authorization?.split(" ")[1];

	if (!accessToken) {
		return next(createError.Unauthorized("Vui lòng đăng nhập"));
	}

	jwt.verify(accessToken, process.env.JWT_SECRET_ACCESS_TOKEN, (err, payload) => {
		if (err) {
			return next(createError.Unauthorized(err.message));
		}

		req.payload = payload;
		next();
	});
}
