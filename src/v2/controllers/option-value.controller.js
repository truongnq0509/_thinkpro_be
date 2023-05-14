
import createError from "http-errors"

export async function create(req, res, next) {
	try {
		const { error } = optionValueSchema.validate(req.body, { abortEarly: false });

		if (error) {
			const errors = {};
			error.details.forEach((e) => (errors[e.path] = e.message));
			throw createError.BadRequest(errors);
		}

		const optionValue = await OptionValue.create(req.body)

		await Option.findOneAndUpdate(
			{
				_id: req.body.optionId,
			},
			{
				$addToSet: {
					optionValues: optionValue._id,
				},
			}
		);

		return res.json({
			message: "successfully",
			data: optionValue
		})
	} catch (error) {
		next(error)
	}
}

export async function update(req, res, next) {
	try {
		const { error } = optionValueSchema.validate(req.body, { abortEarly: false });

		if (error) {
			const errors = {};
			error.details.forEach((e) => (errors[e.path] = e.message));
			throw createError.BadRequest(errors);
		}

		const optionValue = await OptionValue.updateOne({
			_id: req.params.id
		}, req.body)

		return res.json({
			message: "successfully",
			data: optionValue
		})
	} catch (error) {
		next(error)
	}
}

export async function remove(req, res, next) {
	try {
		const { id } = req.params

		const document = await OptionValue.findById(id)

		if (!document) {
			throw createError.BadRequest('Thuộc tính này không tồn tại')
		}

		const option = await Option.findOne({
			optionValues: {
				$in: [id]
			}
		})

		// Xóa trong options -> optionValue
		await Option.findOneAndUpdate({
			_id: option._id
		}, {
			$pull: {
				optionValues: {
					id
				}
			}
		})

		// Xóa trong trực tiếp
		await OptionValue.deleteOne({
			_id: id
		})

		return res.json({
			message: "successfully",
		})
	} catch (error) {
		next(error)
	}
}