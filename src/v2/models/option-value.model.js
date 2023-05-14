import { Schema, model } from "mongoose";

const optionValueSchema = new Schema({
	value: {
		type: String,
	},
	label: {
		type: String,
	},
	productId: {
		type: Schema.Types.ObjectId,
		ref: "Product",
	},
	optionId: {
		type: Schema.Types.ObjectId,
		ref: "Option",
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
	collection: "optionvalues",
	timestamps: true,
	versionKey: false
})

export default model('OptionValue', optionValueSchema)