import { Schema, model } from "mongoose";

const skuSchema = new Schema({
	name: {
		type: String
	},
	price: {
		type: Number
	},
	discount: {
		type: Number
	},
	stock: {
		type: Number
	},
	productId: {
		type: Schema.Types.ObjectId,
		ref: 'Product'
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
	collection: 'skus',
	timestamps: true,
	versionKey: false,
})

export default model('Sku', skuSchema)