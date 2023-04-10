import User from "../models/user.model";
import createError from "http-errors";

export async function checkRole(req, res, next) {
	const { id } = req.payload;
	const { role } = await User.findById(id);

	if (role !== "admin") {
		next(createError.Unauthorized("Không có quyền gọi api này"));
	}

	next();
}
