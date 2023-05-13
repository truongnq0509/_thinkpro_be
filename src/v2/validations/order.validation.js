import joi from "joi"

const orderSchema = joi.object({
	cartId: joi.string().required(),
	shipping: joi.object().required(),
	payment: joi.object().default({}).required(),
	products: joi.array().default([]),
	status: joi.string().default('processing')
})

export default orderSchema