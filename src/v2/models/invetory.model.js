import { Schema, model } from "mongoose";

const inventorySchema = new Schema({
	productId: {
		type: Schema.Types.ObjectId,
		ref: "Product"
	},
	quantity: {
		type: Number
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
	collection: "inventories"
})

export default model('Inventory', inventorySchema)