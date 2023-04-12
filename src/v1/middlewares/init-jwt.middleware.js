import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import createError from "http-errors";
import RefreshToken from "../models/refresh-token.model"

dotenv.config();

export async function signAccessToken(user) {
	try {
		const payload = {
			_id: user._id,
			role: user.role
		};
		const options = {
			expiresIn: "60s",
		};
		const token = jwt.sign(payload, process.env.JWT_SECRET_ACCESS_TOKEN, options);
		return Promise.resolve(token);
	} catch (error) {
		return Promise.reject(error)
	}
}

export async function signRefreshToken(user) {
	try {
		const payload = {
			_id: user._id,
			role: user.role
		};
		const options = {
			expiresIn: "60s",
		};
		const token = jwt.sign(payload, process.env.JWT_SECRT_REFRESH_TOKEN, options);
		// nếu tồn tại thì xóa bỏ token đó đi ngược lại thì tạo
		const userToken = await RefreshToken.findOne({
			userId: user._id
		})

		if (userToken) await userToken.remove()

		await RefreshToken.create({
			userId: user._id,
			token
		})
		return Promise.resolve(token);
	} catch (error) {
		Promise.reject(error)
	}
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

		req.user = payload;
		next();
	});
}

export function verifyRefreshToken(refreshToken) {
	return new Promise(async (resolve, reject) => {
		const userToken = await RefreshToken.findOne({
			token: refreshToken
		})

		if (!userToken) {
			reject(createError.Unauthorized('invalid refresh token'))
		}

		jwt.verify(refreshToken, process.env.JWT_SECRT_REFRESH_TOKEN, (err, payload) => {
			if (err) {
				reject(createError.Unauthorized(err.message))
			}

			resolve(payload)
		})
	})

}