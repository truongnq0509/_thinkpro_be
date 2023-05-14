import Option from '../models/option.model'
import OptionValue from '../models/option-value.model'
import { optionSchema } from "../validations/option.validation"
import createError from "http-errors"

export async function get(req, res, next) {
	try {
		const { id: productId } = req.params

		const options = await Option.find({
			productId
		}).select(['-productId', '-createdAt', '-updatedAt', '-__v']).populate({
			path: "optionValues",
			select: ['-productId', '-optionId', '-createdAt', '-updatedAt', '-__v']
		})
		return res.json({
			message: "successfully",
			data: options
		})
	} catch (error) {
		next(error)
	}
}

export async function create(req, res, next) {
	try {
		const { error } = optionSchema.validate(req.body, { abortEarly: false });

		if (error) {
			const errors = {};
			error.details.forEach((e) => (errors[e.path] = e.message));
			throw createError.BadRequest(errors);
		}

		const option = await Option.create(req.body)

		return res.status(201).json({
			message: "successfully",
			data: option
		})
	} catch (error) {
		next(error)
	}
}

export async function update(req, res, next) {
	try {
		const { error } = optionSchema.validate(req.body, { abortEarly: false });

		if (error) {
			const errors = {};
			error.details.forEach((e) => (errors[e.path] = e.message));
			throw createError.BadRequest(errors);
		}

		const option = await Option.updateOne({
			_id: req.params.id
		}, req.body)

		return res.json({
			message: "successfully",
			data: option
		})
	} catch (error) {
		next(error)
	}
}

export async function remove(req, res, next) {
	try {
		const { id: _id } = req.params
		const option = await Option.findById(_id)

		if (!option) {
			throw createError.BadRequest('Option không tồn tại');
		}

		const optionValues = await OptionValue.find({
			optionId: option._id
		})

		for (let item of optionValues) {
			await OptionValue.deleteOne({
				_id: item._id
			})
		}

		await option.delete()

		return res.json({
			message: "successfully",
		})
	} catch (error) {
		next(error)
	}
}

