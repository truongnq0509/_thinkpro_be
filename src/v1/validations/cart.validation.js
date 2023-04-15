import joi from "joi"

const cartSchema = joi.object({
	status: joi.boolean().default(false),
	productId: joi.string().required(),
	quantity: joi.number().min(1).required(),
	createdAt: joi.string().default(() => new Date()),
	updatedAt: joi.string().default(() => new Date()),
	deletedAt: joi.date().default(null),
	deleted: joi.boolean().default(false),
})

export default cartSchema