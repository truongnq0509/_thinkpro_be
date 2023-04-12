import joi from "joi";

const signinSchema = joi.object({
	email: joi.string().email().required(),
	password: joi.string().min(6).required().messages({}),
});

const signupSchema = joi.object({
	firstName: joi.string().required(),
	lastName: joi.string().required(),
	avatar: joi.string().required(),
	phone: joi.string().length(10).pattern(/^[0-9]+$/).required().messages({
		"string.pattern.base": "invalid phone"
	}),
	email: joi.string().email().required(),
	password: joi.string().min(6).required().messages({}),
	confirmPassword: joi.any().equal(joi.ref("password")).required(),
	role: joi.string().optional().default('user'),
	isBlocked: joi.boolean().default(false),
	createdAt: joi.string().default(() => new Date()),
	updatedAt: joi.string().default(() => new Date()),
});

export { signinSchema, signupSchema };
