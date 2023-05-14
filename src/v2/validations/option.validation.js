import joi from "joi"

export const optionSchema = joi.object({
	productId: joi.string().required(),
	name: joi.string().required(),
	createdAt: joi.string().default(() => new Date()),
	updatedAt: joi.string().default(() => new Date()),
})

export const optionValueSchema = joi.object({
	value: joi.string().required(),
	label: joi.string().required(),
	productId: joi.string().required(),
	optionId: joi.string().required(),
	createdAt: joi.string().default(() => new Date()),
	updatedAt: joi.string().default(() => new Date()),
})