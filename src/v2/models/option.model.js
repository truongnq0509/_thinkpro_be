import { Schema, model } from "mongoose";

const optionSchema = new Schema({
	name: {
		type: String,
	},
	productId: {
		type: Schema.Types.ObjectId,
		ref: "Product",
	},
	optionValues: [
		{
			type: Schema.Types.ObjectId,
			ref: 'OptionValue'
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
}, {
	collection: "options",
	timestamps: true,
	versionKey: false
})

export default model('Option', optionSchema)