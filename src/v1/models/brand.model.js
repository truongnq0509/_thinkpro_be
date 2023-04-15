import slug from "mongoose-slug-updater";
import mongooseDelete from "mongoose-delete";
import { Schema, model } from "mongoose";

const plugins = [slug, mongooseDelete];

const brandSchema = new Schema(
	{
		name: {
			type: String,
		},
		slug: {
			type: String,
			slug: "name",
			unique: true,
			index: true,
			sparse: true,
			slugOn: { save: true, update: true, updateOne: true, updateMany: true, findOneAndUpdate: true },
		},
		image: {
			type: Object,
		},
		parentId: {
			type: Schema.Types.ObjectId,
			default: null,
		},
		description: {
			type: String,
		},
		categoryIds: [
			{
				type: Schema.Types.ObjectId,
				ref: "Category",
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
		collections: "brands",
		timestamp: true,
	}
);

plugins.forEach((item) => brandSchema.plugin(item, { overrideMethods: true }));

export default model("Brand", brandSchema);
