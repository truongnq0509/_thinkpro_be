import Category from "../models/category.model";
import categorySchema from "../validations/category.validation";
import createError from "http-errors";

export async function get(req, res, next) {
	try {
		const slug = req.query.slug || false;
		if (slug) {
			const category = await Category.findOne({
				slug,
			})
				.select(["-deleted", "-deletedAt", "-parentId"])
				.populate({
					path: "brands",
					select: ["-products", "-deleted", "-deletedAt", "-categoryIds"],
				})
				.populate({
					path: "products",
					select: ["-deleted", "-deletedAt", "-categoryId"],
				});

			if (!category) {
				throw createError.BadRequest("Danh mục này không tồn tại");
			}

			const brands = category.toObject().brands.filter((item) => item.parentId == null);

			return res.json({
				message: "successfully",
				data: {
					...category.toObject(),
					brands,
				},
			});
		} else {
			let categorise = await Category.find({}).select(["-brands", "-products", "-deleted", "-deletedAt"]);
			return res.json({
				message: "successfully",
				data: categorise,
			});
		}
	} catch (error) {
		next(error);
	}
}

export async function create(req, res, next) {
	try {
		const { error } = categorySchema.validate(req.body, { abortEarly: false });

		if (error) {
			const errors = {};
			error.details.forEach((e) => (errors[e.path] = e.message));
			throw createError.BadRequest(errors);
		}

		const category = await Category.create(req.body);

		return res.status(201).json({
			message: "successfully",
			data: category,
		});
	} catch (error) {
		next(error);
	}
}

export async function update(req, res, next) {
	try {
		const { error } = categorySchema.validate(req.body, { abortEarly: false });

		if (error) {
			const errors = {};
			error.details.forEach((e) => (errors[e.path] = e.message));
			throw createError.BadRequest(errors);
		}

		const category = await Category.updateOne(
			{
				_id: req.params.id,
			},
			req.body
		);

		return res.status(200).json({
			message: "successfully",
			data: category,
		});
	} catch (error) {
		next(error);
	}
}

export async function remove(req, res, next) {
	try {
		const category = await Category.findOneWithDeleted({
			_id: req.params.id,
		});
		const isForce = JSON.parse(req.query.force || false);

		if (!category) {
			throw createError.BadRequest("Danh mục này không tồn tại");
		}

		isForce ? category.deleteOne() : category.delete();

		return res.json({
			message: "successfully",
			data: category,
		});
	} catch (error) {
		next(error);
	}
}

export async function restore(req, res, next) {
	try {
		const category = await Category.findOneWithDeleted({
			_id: req.params.id,
		});

		if (!category) {
			throw createError.BadRequest("Danh mục này không tồn tại");
		}

		if (!category?.deleted) {
			throw createError.BadRequest("Danh mục chưa bị xóa mềm");
		}

		await category.restore();

		return res.json({
			message: "successfully",
		});
	} catch (error) {
		next(error);
	}
}
