import createError from "http-errors";
import { cloudinary } from "../config/cloudinary.config";


export async function getSingleFile(req, res, next) {
	try {
		if (!req.file) {
			throw createError.BadRequest("No file !!!");
		}

		return res.json({
			message: "successfully",
			data: {
				path: req.file.path,
				filename: req.file.filename
			}
		})
	} catch (error) {
		next(error)
	}
}

export async function getMultipleFile(req, res, next) {
	try {
		if (!req.files) {
			throw createError.BadRequest("No file !!!");
		}

		let images = req?.files["images"] || req?.files["assets"];

		images = images?.map((img, index) => {
			return {
				id: index + 1,
				path: img?.path,
				filename: img?.filename,
			};
		});

		return res.json({
			message: "successfully",
			data: images,
		});
	} catch (error) {
		next(error);
	}
}

export async function removeFile(req, res, next) {
	try {
		const filename = req.query.filename;
		await cloudinary.uploader.destroy(filename);
		return res.json({
			messsage: "successfully",
		});
	} catch (error) {
		next(error);
	}
}

export async function uploadFile(req, res, next) {
	try {
		if (!req.file.path) {
			throw createError.BadRequest("No file !!!");
		}
		const filename = req.params.filename;
		await cloudinary.uploader.destroy(filename);

		return res.json({
			message: "upload successfully",
			data: req.file.path,
		});
	} catch (error) {
		next(error);
	}
}
