import User from "../models/user.model";
import RefreshToken from "../models/refresh-token.model"
import createError from "http-errors";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../middlewares/init-jwt.middleware";
import { signinSchema, signupSchema } from "../validations/auth.validation";
import bcryptjs from "bcryptjs";

export async function signin(req, res, next) {
	try {
		const { email, password } = req.body;

		const { error } = signinSchema.validate(req.body, { abortEarly: false });

		if (error) {
			const errors = {};
			error.details.forEach((e) => (errors[e.path] = e.message));
			throw createError.BadRequest(errors);
		}

		const user = await User.findOne({
			email,
		});

		if (!user) {
			throw createError.BadRequest("Email chưa được đăng ký");
		}

		const isPassword = await bcryptjs.compare(password, user.password);

		if (!isPassword) {
			throw createError.Unauthorized("Mật khẩu không đúng");
		}

		const accessToken = await signAccessToken(user);
		const refreshToken = await signRefreshToken(user);

		const optionsCookies = {
			httpOnly: true
		}

		res.cookie("refreshToken", refreshToken, optionsCookies)
		res.cookie("loggedIn", "true", optionsCookies)

		return res.json({
			message: "successfully",
			accessToken,
		});
	} catch (error) {
		next(error);
	}
}

export async function signup(req, res, next) {
	try {
		const { email } = req.body;
		const { error } = signupSchema.validate(req.body, { abortEarly: false });

		if (error) {
			const errors = {};
			error.details.forEach((e) => (errors[e.path] = e.message));
			throw createError.BadRequest(errors);
		}

		const response = await User.findOne({
			email,
		});

		if (response) {
			throw createError.BadRequest("Email này đã được đăng ký");
		}

		const user = await User.create(req.body);
		const accessToken = await signAccessToken(user);

		user.password = undefined;

		return res.status(201).json({
			message: "successfully",
			data: user,
			accessToken,
		});
	} catch (error) {
		next(error);
	}
}

export async function me(req, res, next) {
	try {
		const { _id } = req.user

		const user = await User.findById(_id)
		user.password = undefined

		return res.json({
			message: "successfully",
			data: {
				firstName: user.firstName,
				lastName: user.lastName,
				avatar: user.avatar,
				phone: user.rphoneole,
				email: user.roemaille,
				role: user.role,
			}
		})
	} catch (error) {
		next(error)
	}
}

export async function refresh(req, res, next) {
	try {
		const refreshToken = req?.cookies?.refreshToken
		const user = await verifyRefreshToken(refreshToken)
		const newAccessToken = await signAccessToken(user)

		return res.json({
			message: "successfully",
			accessToken: newAccessToken
		})
	} catch (error) {
		next(error)
	}
}

export async function logout(req, res, next) {
	try {
		const refreshToken = req.cookie('refreshToken')

		const userToken = await RefreshToken.findOne({
			token: refreshToken
		})

		const optionsCookies = {
			httpOnly: true
		}
		res.clearCookie("refreshToken")
		res.cookie('loggedInd', "false", optionsCookies)

		if (!userToken) {
			return res.json({
				message: "logged out successfully"
			})
		}

		userToken.remove()

		return res.json({
			message: "logged out successfully"
		})
	} catch (error) {
		next(error)
	}
}