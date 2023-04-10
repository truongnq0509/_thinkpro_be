import joi from "joi";

const categorySchema = joi.object({
	name: joi.string().required(),
	slug: joi.string().required(),
	image: joi.object().required(),
	description: joi.string().required(),
	createdAt: joi.string().default(() => new Date()),
	updatedAt: joi.string().default(() => new Date()),
	deletedAt: joi.date().default(null),
	delete: joi.boolean().default(false),
});

export default categorySchema;
