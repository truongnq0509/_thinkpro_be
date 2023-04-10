import slug from "mongoose-slug-updater";
import mongooseDelete from "mongoose-delete";
import { Schema, model } from "mongoose";

const plugins = [slug, mongooseDelete];

const categorySchema = new Schema(
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
		image: {
			type: Object,
		},
		description: {
			type: String,
			required: true,
		},
		brands: [
			{
				type: Schema.Types.ObjectId,
				ref: "Brand",
			},
		],
		products: [
			{
				type: Schema.Types.ObjectId,
				ref: "Product",
			},
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
	},
	{
		collections: "categories",
		timestamp: true,
	}
);

plugins.forEach((item) => categorySchema.plugin(item, { overrideMethods: true }));

export default model("Category", categorySchema);
