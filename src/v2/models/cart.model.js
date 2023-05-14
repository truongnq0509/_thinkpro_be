import { model, Schema } from "mongoose"

const cartSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	status: {
		type: Boolean,
		default: false
	},
	products: [
		{
			productId: {
				type: Schema.Types.ObjectId,
				ref: "Product"
			},
			quantity: Number
		}
	],
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	deletedAt: {
		type: Date,
		default: null,
	},
	deleted: {
		type: Boolean,
		default: false,
	},
}, {
	timestamps: true,
	versionKey: false
})

export default model("Cart", cartSchema)