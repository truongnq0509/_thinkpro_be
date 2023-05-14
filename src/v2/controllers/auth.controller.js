import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import createError from "http-errors";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../middlewares/init-jwt.middleware";
import RefreshToken from "../models/refresh-token.model";
import User from "../models/user.model";
import { sendEmail } from "../utils/send-email.util";
import { v4 as uuidv4 } from "uuid";
import { resetPasswordSchema, sendSchema, signinSchema, signupSchema } from "../validations/auth.validation";

dotenv.config()

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
			throw createError.BadRequest("Mật khẩu không đúng");
		}

		const accessToken = await signAccessToken(user);
		const refreshToken = await signRefreshToken(user);

		const optionsCookies = {
			httpOnly: true,
			maxAge: 30 * 24 * 60 * 1000
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

		const token = uuidv4()

		const optionsCookies = {
			httpOnly: true,
			maxAge: 15 * 60 * 1000
		}

		res.cookie("user", { data: { ...req.body }, token }, optionsCookies)
		const link = `<h5>Vui lòng click vào link để xác minh tài khoản thời gian hiệu lực trong vòng 15' <a href="http://localhost:${process.env.PORT}/api/v2/auth/verify-email/${token}">link</a></h5>`
		await sendEmail({
			email: req.body.email
		}, "Thinkpro xác thực danh tính của bạn", link)

		return res.json({
			message: 'successfully'
		})

	} catch (error) {
		next(error);
	}
}

export async function verifyRegisterEmail(req, res, next) {
	try {
		const user = req?.cookies.user

		if (!user) {
			return res.redirect(`${process.env.FE_URL}/xac-minh/expired`)
		}

		const { data, token: tokenCookie } = user
		const { token } = req?.params

		if (!user || tokenCookie != token) {
			res.clearCookie("user");
			return res.redirect(`${process.env.FE_URL}/xac-minh/faild`)
		}

		const newUser = await User.create({
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			password: data.password,
			avatar: data.avatar,
			phone: data.phone
		});

		const accessToken = await signAccessToken(newUser);
		newUser.password = undefined;

		res.clearCookie("user");
		res.redirect(`${process.env.FE_URL}/xac-minh/success`)

		return res.status(201).json({
			message: "successfully",
			data: newUser,
			accessToken,
		});
	} catch (error) {
		next(error)
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
		const refreshToken = req?.cookies?.refreshToken


		const userToken = await RefreshToken.findOne({
			token: refreshToken
		})

		const optionsCookies = {
			httpOnly: true
		}
		res.clearCookie("refreshToken")
		res.cookie('loggedIn', "false", optionsCookies)

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

export async function send(req, res, next) {
	try {
		const { error } = await sendSchema.validate(req.body, { abortEarly: false })

		if (error) {
			const errors = {};
			error.details.forEach((e) => (errors[e.path] = e.message));
			throw createError.BadRequest(errors);
		}

		const user = await User.findOne({
			email: req.body.email
		})

		if (!user) {
			throw createError.BadRequest('Email chưa được đăng ký')
		}

		let token = await RefreshToken.findOne({
			userId: user?._id
		})

		if (!token) {
			token = await signRefreshToken(user)
		}

		const link = `${process.env.FE_URL}/reset-mat-khau?token=${token.toObject().token || token}&id=${user.toObject()._id}`
		const html = `
				<!Doctype>
				<html lang="en">
				<title>Password Reset Email</title>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width">
				<style type="text/css">
					/* client specific styles*/
					/* Reset CSS styles */
					/*Mobile styles */
				</style>
				</head>
				<body style="background-color: #f9f9f9">
					<!-- start of header table -->
					<table width="100%" border="0" cellpadding="0" cellspacing="0">
						<tr>
							<td align="center">
								<!-- start of logo wrapper -->
								<table width="600px" border="0" cellpadding="0" cellspacing="0">
									<tr>
										<td align="center" style="padding: 60px 0 32px 0">
											<img src="https://res.cloudinary.com/dgpzzy5sg/image/upload/v1682650276/295024167_4122326987907987_3215292870388820709_n_yjaghm.jpg"
												width="60" alt="Logo picture of dressed pineapple"
												style="display: block; border-radius: 3px; height: 60px;object-fit: cover; border-radius: 50%;"  border="0">
				
										</td>
									</tr>
								</table>
								<!-- end of logo wrapper -->
							</td>
						</tr>
					</table>
					<!-- end of header table -->
					<!-- start of body table -->
					<table width="100%" border="0" cellpadding="0" cellspacing="0" style="padding-bottom: 60px;">
						<tr>
							<td align="center">
								<!-- start of body wrapper -->
								<table width="600px" border="0" cellpadding="0" cellspacing="0"
									style="background-color: #fff;padding: 40px 50px; border-radius: 6px">
									<tr>
										<td align="left">
											<h2
												style="font-family:Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-weight:500;font-size:20px;color:#4f545c;letter-spacing:0.27px">
												${user.firstName + user.lastName} này,
											</h2>
											<p
												style="font-family:Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-weight:500;font-size:16px;color:#737f8d;letter-spacing:0.27px">
												Mật khẩu Thinkpro của bạn có thể được reset bằng nút bên dưới. Nếu bạn không yêu cầu mật
												khẩu mới, hãy bỏ qua email này.</p>
										</td>
									</tr>
									<tr>
										<td>
											<table width="100%" border="0" cellpadding="0" cellspacing="0">
												<tr>
													<td align="center">
														<table border="0" cellpadding="0" cellspacing="0">
															<tr>
																<td style="word-break:break-word;font-size:0px;padding:10px 25px;padding-top:20px"
																	align="center">
																	<table role="presentation" cellpadding="0" cellspacing="0"
																		style="border-collapse:separate" align="center" border="0">
																		<tbody>
																			<tr>
																				<td style="border:none;border-radius:3px;color:white;padding:15px 19px"
																					align="center" valign="middle" bgcolor="#0ec2d3"><a
																						href="${link}"
																						style="text-decoration:none;line-height:100%;background:#0ec2d3;color:white;font-family:Ubuntu,Helvetica,Arial,sans-serif;font-size:15px;font-weight:normal;text-transform:none;margin:0px"
																						target="_blank"
																						data-saferedirecturl="${link}">
																						Reset Mật Khẩu
																					</a></td>
																			</tr>
																		</tbody>
																	</table>
																</td>
															</tr>
															<tr>
																<td style="word-break:break-word;font-size:0px;padding:30px 0px">
																	<p
																		style="font-size:1px;margin:0px auto;border-top:1px solid #dcddde;width:100%">
																	</p>
																</td>
															</tr>
															<tr>
																<td style="word-break:break-word;font-size:0px;padding:0px"
																	align="left">
																	<div
																		style="color:#747f8d;font-family:Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-size:13px;line-height:16px;text-align:left">
																		<p>Cần giúp đỡ? <a
																				href="https://thinkpro.vn"
																				style="font-family:Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;color:#5865f2"
																				target="_blank">Liên
																				hệ nhóm hỗ trợ</a> hoặc thông qua Twitter <a
																				href="https://thinkpro.vn"
																				style="font-family:Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;color:#5865f2"
																				target="_blank">@thinkpro</a>.<br>
																			Muốn cung cấp phản hồi? Hãy cho chúng tôi biết ý kiến của
																			bạn trên <a
																				href="https://thinkpro.vn"
																				style="font-family:Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;color:#5865f2"
																				target="_blank" >trang
																				phản hồi</a>.</p>
				
																	</div>
																</td>
															</tr>
														</table>
													</td>
												</tr>
				
											</table>
				
										</td>
									</tr>
								</table>
								<!-- end of body wrapper -->
							</td>
						</tr>
					</table>
				</body>
			</html>
		`
		await sendEmail(user, "Yêu Cầu Đặt Lại Mật Khẩu Thinkpro", html)

		return res.json({
			message: "successfully"
		})
	} catch (error) {
		next(error)
	}
}

export async function resetPassword(req, res, next) {
	try {
		const { error } = await resetPasswordSchema.validate(req.body, { abortEarly: false })

		if (error) {
			const errors = {};
			error.details.forEach((e) => (errors[e.path] = e.message));
			throw createError.BadRequest(errors);
		}

		const user = await User.findOne({
			_id: req.body.userId,
		})

		if (!user) {
			throw createError.BadRequest('Tài khoản không tồn tại')
		}

		await User.updateOne({
			_id: req.body.userId,
		}, {
			$set: {
				password: req.body.password
			}
		})

		await RefreshToken.deleteOne({
			userId: req.body.userId
		})

		return res.json({
			message: "Thay đổi mật khẩu thành công"
		})
	} catch (error) {
		next(error)
	}
}
