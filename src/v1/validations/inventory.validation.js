import joi from 'joi'

const inventorySchema = joi.object({
	productId: joi.string().required(),
	quantity: joi.number().required(),
})

export default inventorySchema