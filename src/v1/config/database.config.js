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

		mongoose.set("strictQuery", false);
		await mongoose.connect("mongodb://0.0.0.0:27017/thinkpro", {
			useUnifiedTopology: true,
			useNewUrlParser: true
		});
	} catch (error) {
		console.log(error)
	}
}
