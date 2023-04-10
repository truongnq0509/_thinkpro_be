import { Schema, model } from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			default: "member",
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
		collection: "users",
	}
);

userSchema.pre("save", async function (next) {
	const hashPassword = await bcryptjs.hash(this.password, 10);
	this.password = hashPassword;
	next();
});

export default model("User", userSchema);
