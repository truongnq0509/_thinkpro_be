import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connect() {
	try {
		mongoose.connection.on("connecting", () => {
			console.log("connecting");
		});
		mongoose.connection.on("connected", () => {
			console.log("connected");
		});
		mongoose.connection.on("disconnecting", () => {
			console.log("disconnecting");
		});
		mongoose.connection.on("disconnected", () => {
			console.log("disconnected");
		});

		await mongoose.connect("mongodb://127.0.0.1:27017/thinkpro-v2");
	} catch (error) { }
}
