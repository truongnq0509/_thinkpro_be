import { Schema, model } from "mongoose";

const variantSchema = new Schema({
	productId: {
		type: Schema.Types.ObjectId,
		ref: "Product"
	},
	optionId: {
		type: Schema.Types.ObjectId,
		ref: 'Option'
	},
	optionValueId: {
		type: Schema.Types.ObjectId,
		ref: 'OptionValue'
	},
	skuId: {
		type: Schema.Types.ObjectId,
		ref: "Sku"
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
}, {
	timestamps: true,
	collection: 'variants',
	versionKey: false
})

export default model('Variant', variantSchema)