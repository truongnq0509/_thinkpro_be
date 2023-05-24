import Brand from "../models/brand.model";
import Category from "../models/category.model";
import brandSchema from "../validations/brand.validation";
import createError from "http-errors";

function nestedBrands(input, parentId) {
	const output = [];
	let brands = null;

	if (parentId) {
		brands = input.filter((brand) => String(brand.parentId) == String(parentId));
	} else {
		brands = input.filter((brand) => brand.parentId == parentId);
	}

	for (let brand of brands) {
		output.push({
			_id: brand._id,
			name: brand.name,
			slug: brand.slug,
			image: brand.image,
			description: brand.description,
			children: nestedBrands(input, brand._id),
			updatedAt: brand.updatedAt,
			createdAt: brand.createdAt,
			deletedAt: brand.deletedAt,
			deleted: brand.deleted,
		});
	}

	return output;
}

export async function get(req, res, next) {
	try {
		const { _page = 1, _sort = "createdAt", _order = "asc", _limit = 15, slug = false } = req.query;
		const optionSub = {
			select: ["_id", "name", "slug", "image", "description", "products", "categoryIds"],
			pagingOptions: {
				populate: {
					path: "products",
					options: {
						page: _page,
						limit: _limit,
						sort: {
							[_sort]: _order == "desc" ? -1 : 1,
						},
					}
				},
			},
		};

		const options = {
			page: _page,
			limit: _limit,
			sort: {
				[_sort]: _order == "desc" ? -1 : 1,
			},
		};

		if (slug) {
			let brand = await Brand.paginateSubDocs({
				slug,
			}, optionSub)
			let brands = await Brand.find({});
			let children = nestedBrands(brands, brand._id)

			if (!brand) {
				throw createError.BadRequest("Thương hiệu này không tồn tại");
			}

			return res.json({
				message: "successfully",
				data: {
					...brand.toObject(),
					children
				},
			});
		} else {
			let {
				docs,
				totalPages,
				totalDocs,
				limit,
				hasPrevPage,
				pagingCounter,
				hasNextPage,
				page,
				nextPage,
				prevPage,
			} = await Brand.paginate({}, options);
			let brands = await Brand.find({})

			brands = nestedBrands(brands);

			return res.json({
				message: "successfully",
				data: docs,
				paginate: {
					limit,
					totalDocs,
					totalPages,
					page,
					pagingCounter,
					hasPrevPage,
					hasNextPage,
					prevPage,
					nextPage,
				},
			});
		}
	} catch (error) {
		next(error);
	}
}

export async function getParent(req, res, next) {
	try {
		const { _page = 1, _sort = "createdAt", _order = "asc", _limit = 15 } = req.query;
		const options = {
			page: _page,
			limit: _limit,
			sort: {
				[_sort]: _order == "desc" ? -1 : 1,
			},
			select: ["-products", "-categoryIds"]
		};

		let {
			docs,
			totalPages,
			totalDocs,
			limit,
			hasPrevPage,
			pagingCounter,
			hasNextPage,
			page,
			nextPage,
			prevPage,
		} = await Brand.paginate({}, options);

		docs = docs?.filter((item) => !item.parentId)

		return res.json({
			message: "successfully",
			data: docs,
			paginate: {
				limit,
				totalDocs,
				totalPages,
				page,
				pagingCounter,
				hasPrevPage,
				hasNextPage,
				prevPage,
				nextPage,
			},
		});
	} catch (error) {
		next(error)
	}
}

export async function create(req, res, next) {
	try {
		const { error } = brandSchema.validate(req.body, { abortEarly: false });

		if (error) {
			const errors = {};
			error.details.forEach((e) => (errors[e.path] = e.message));
			throw createError.BadRequest(errors);
		}

		const brand = await Brand.create(req.body);
		const { categoryIds } = req.body;

		await Promise.all(
			categoryIds?.map(
				async (categoryId) =>
					await Category.findOneAndUpdate(
						{
							_id: categoryId,
						},
						{
							$addToSet: {
								brands: brand._id,
							},
						}
					)
			)
		);

		return res.status(201).json({
			message: "successfully",
			data: brand,
		});
	} catch (error) {
		next(error);
	}
}

export async function update(req, res, next) {
	try {
		const { error } = brandSchema.validate(req.body, { abortEarly: false });

		if (error) {
			const errors = {};
			error.details.forEach((e) => (errors[e.path] = e.message));
			throw createError.BadRequest(errors);
		}

		const brand = await Brand.updateOne(
			{
				_id: req.params.id,
			},
			req.body
		);

		return res.status(200).json({
			message: "successfully",
			data: brand,
		});
	} catch (error) {
		next(error);
	}
}

export async function remove(req, res, next) {
	try {
		const brand = await Brand.findOneWithDeleted({
			_id: req.params.id,
		});
		const isForce = JSON.parse(req.query.force || false);

		if (!brand) {
			throw createError.BadRequest("Thương hiệu này không tồn tại");
		}

		if (!brand.parentId) {
			const subBrand = await Brand.findWithDeleted({
				parentId: brand.toObject()._id,
			});
			subBrand.forEach(async (item) => (isForce ? await item.deleteOne() : await item.delete()));
		}

		isForce ? brand.deleteOne() : brand.delete();

		return res.json({
			message: "successfully",
			data: brand,
		});
	} catch (error) {
		next(error);
	}
}

export async function restore(req, res, next) {
	try {
		const brand = await Brand.findOneWithDeleted({
			_id: req.params.id,
		});

		if (!brand) {
			throw createError.BadRequest("Thương hiệu này không tồn tại");
		}

		if (!brand?.deleted) {
			throw createError.BadRequest("Danh mục chưa bị xóa mềm");
		}

		if (!brand.parentId) {
			const subBrand = await Brand.findWithDeleted({
				parentId: brand.toObject()._id,
			});
			subBrand.forEach(async (item) => await item.restore());
		}

		await brand.restore();

		return res.json({
			message: "successfully",
		});
	} catch (error) {
		next(error);
	}
}
