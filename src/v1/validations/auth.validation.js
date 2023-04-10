import joi from "joi";

const signinSchema = joi.object({
	email: joi.string().email().required(),
	password: joi.string().min(6).required().messages({}),
});

const signupSchema = joi.object({
	email: joi.string().email().required(),
	password: joi.string().min(6).required().messages({}),
	confirmPassword: joi.any().equal(joi.ref("password")).required(),
});

export { signinSchema, signupSchema };
