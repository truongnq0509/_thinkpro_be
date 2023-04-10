import User from "../models/user.model";
import createError from "http-errors";
import { signAccessToken, signRefreshToken } from "../middlewares/init_jwt.middleware";
import { signinSchema, signupSchema } from "../validations/auth.validation";
import bcryptjs from "bcryptjs";

export async function signin(req, res, next) {
	try {
		const { email, password } = req.body;
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

		const accessToken = signAccessToken({ id: user._id });
		const refreshToken = signRefreshToken({ id: user._id });

		user.password = undefined;

		return res.json({
			message: "successfully",
			data: user,
			accessToken,
			refreshToken,
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
		const accessToken = signAccessToken({ id: user._id });

		user.password = undefined;

		return res.json({
			message: "successfully",
			data: user,
			accessToken,
		});
	} catch (error) {
		next(error);
	}
}
