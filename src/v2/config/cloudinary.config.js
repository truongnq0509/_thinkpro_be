import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
	cloudinary,
	params: async (req, file) => {
		let folder = "products";
		let width = 460;
		let height = 460;

		if (file.fieldname === "assets") {
			width = 200;
			height = 200;
		} else if (file.fieldname == "brand") {
			width = 68;
			height = 68;
			folder = "brands";
		} else if (file.fieldname === "images" || file.fieldname === "thumbnail") {
			width = 96;
			height = 96;
			folder = "categories";
		}

		// crop cắt theo tỉ lệ theo kích thước nó giống object-fit...
		return {
			folder: `thinkpro/${folder}`,
			allowedFormats: ["jpg", "png"],
			transformation: [{ width, height, crop: "fit" }],
		};
	},
});

const uploadCloud = multer({ storage });

export { cloudinary };
export default uploadCloud;
