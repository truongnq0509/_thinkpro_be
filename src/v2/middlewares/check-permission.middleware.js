import createError from "http-errors";

export async function checkPermission(req, res, next) {
	const { role } = req.user;

	if (role == "admin" || role == "editor") {
		return next();
	}
	next(createError.Unauthorized("Không có quyền gọi api này"));
}
