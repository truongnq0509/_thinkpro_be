import { Schema, model } from "mongoose";


const refreshTokenSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	token: {
		type: String,
		required: true
	},
	createdAt: { type: Date, default: Date.now, expires: 30 * 86400 }
}, {
	collection: "refreshtokens",
	versionKey: false
})


export default model("RefreshToken", refreshTokenSchema)