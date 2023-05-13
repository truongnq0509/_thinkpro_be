import Category from "../models/category.model";
import Product from "../models/product.model"
import categorySchema from "../validations/category.validation";
import createError from "http-errors";

export async function get(req, res, next) {
	try {
		const slug = req.query.slug || false;
		const { _page = 1, _sort = "createdAt", _order = "asc", _limit = 15 } = req.query;

		const optionSub = {
			select: ["_id", "name", "slug", "image", "description", "products", "brands"],
			pagingOptions: [
				{
					populate: {
						path: "products",
						select: ["-categoryId", "-brandId", "-deleted", "-deletedAt", "-createdAt", "-updatedAt", "-status", "-__v"],
						options: {
							page: _page,
							limit: _limit,
							sort: {
								[_sort]: _order == "desc" ? -1 : 1
							}
						},
					},
				},
				{
					populate: {
						path: "brands",
						select: ["-categoryIds", "-products", "-parentId", "-deleted", "-deletedAt", "-createdAt", "-updatedAt", "-status", "-__v"],
					},
				}
			],
		};
		if (slug) {
			const category = await Category.paginateSubDocs({
				slug,
			}, optionSub)

			if (!category) {
				throw createError.BadRequest("Danh mục này không tồn tại");
			}

			return res.json({
				message: "successfully",
				data: category
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
