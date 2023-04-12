import { Schema, model } from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true
		},
		lastName: {
			type: String,
			required: true
		},
		avatar: {
			type: Object,
			required: true
		},
		email: {
			type: String,
			required: true,
			require: true
		},
		password: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true
		},
		isBlocked: {
			type: Boolean,
			default: false
		},
		role: {
			type: String,
			enum: ["user", "editer", "admin"],
			default: "user",
		},
		createdAt: {
			type: Date,
			default: Date.now
		},
		updatedAt: {
			type: Date,
			default: Date.now
		},
	},
	{
		collection: "users",
		timestamps: true
	}
);

userSchema.pre("save", async function (next) {
	try {
		const hashPassword = await bcryptjs.hash(this.password, 10);
		this.password = hashPassword;
		next();
	} catch (error) {
		next(error)
	}
});

export default model("User", userSchema);
