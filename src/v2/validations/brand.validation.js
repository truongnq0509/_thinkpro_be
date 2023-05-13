import joi from "joi";

const brandSchema = joi.object({
	name: joi.string().required(),
	slug: joi.string(),
	image: joi.object().required(),
	description: joi.string(),
	categoryIds: joi.array().allow(null),
	parentId: joi.string().allow(null).default(null),
	createdAt: joi.string().default(() => new Date()),
	updatedAt: joi.string().default(() => new Date()),
	deletedAt: joi.date().default(null),
	deleted: joi.boolean().default(false),
});

export default brandSchema;
