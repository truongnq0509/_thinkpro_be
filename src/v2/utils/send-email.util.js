import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

export async function sendEmail(user, subject, html) {
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
			from: `Thinkpro ${process.env.USER}`,
			to: user?.email,
			subject,
			html
		})
	} catch (error) {
		console.log(error)
	}
}