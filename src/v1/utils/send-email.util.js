import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

export async function sendEmail(user, subject, text) {
	try {
		const transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 587,
			secure: false,
			auth: {
				user: process.env.USER,
				pass: process.env.PASS,
			},
		})

		await transporter.sendMail({
			from: process.env.USER,
			to: user?.email,
			subject,
			html: `
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
										<img src="https://scontent.fhan17-1.fna.fbcdn.net/v/t39.30808-6/295024167_4122326987907987_3215292870388820709_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=fDZZeeeyGHkAX_whsDJ&_nc_ht=scontent.fhan17-1.fna&oh=00_AfA8pZxht9k1ovHxZ0N4BForTIgL0p8tBhZKflLLY_lcNA&oe=643CBB63"
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
																					href="${text}"
																					style="text-decoration:none;line-height:100%;background:#0ec2d3;color:white;font-family:Ubuntu,Helvetica,Arial,sans-serif;font-size:15px;font-weight:normal;text-transform:none;margin:0px"
																					target="_blank"
																					data-saferedirecturl="${text}">
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
		})

		console.log("send email successfully")
	} catch (error) {
		console.log(process.env.PASS)
		console.log(error)
	}
}