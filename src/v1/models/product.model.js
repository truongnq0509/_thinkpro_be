import slug from "mongoose-slug-updater";
import mongooseDelete from "mongoose-delete";
import mongoosePaginate from "mongoose-paginate-v2";
import { Schema, model, plugin } from "mongoose";

const plugins = [slug, mongooseDelete, mongoosePaginate];

const productSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		slug: {
			type: String,
			slug: "name",
			unique: true,
			required: true,
			slugOn: { save: true, update: true, updateOne: true, updateMany: true, findOneAndUpdate: true },
		},
		thumbnail: {
			type: Object,
		},
		assets: {
			type: Array,
			default: [],
		},
		price: {
			type: Number,
		},
		discount: {
			type: Number,
			default: null,
		},
		description: {
			type: String,
		},
		status: {
			type: Number,
			default: 0,
		},
		attributes: {
			type: Array,
			default: [],
		},
		categoryId: {
			type: Schema.Types.ObjectId,
			ref: "Category",
		},
		brandId: {
			type: Schema.Types.ObjectId,
			ref: "Brand",
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
	},
	{
		collection: "products",
		timestamp: true,
	}
);

plugins.forEach((item) => productSchema.plugin(item, { overrideMethods: true }));

export default model("Product", productSchema);
