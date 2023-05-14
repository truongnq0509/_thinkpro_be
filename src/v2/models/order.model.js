import { Schema, model } from "mongoose"
import mongooseDelete from "mongoose-delete";
import mongoosePaginate from "mongoose-paginate-v2";

const plugins = [mongooseDelete, mongoosePaginate];

const orderSchema = new Schema({
	cartId: {
		type: Schema.Types.ObjectId,
		ref: "Cart"
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	shipping: {
		type: Object,
	},
	payment: {
		type: Object
	},
	products: {
		type: Array
	},
	bill: {
		type: Number,
	},
	status: {
		type: String,
		default: "processing",
		emun: ['processing', "delivering", "cancelled", "delivered"]
	},
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


plugins.forEach((item) => orderSchema.plugin(item, { overrideMethods: true }));

export default model("Order", orderSchema)