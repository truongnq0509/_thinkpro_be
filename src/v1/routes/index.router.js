import categories from "./category.router";
import brands from "./brand.router";
import products from "./product.router";
import upload from "./upload.router";
import auth from "./auth.router";
import insert from "./insert.router"

const routes = (app) => {
	app.use("/api/v1/categories", categories);
	app.use("/api/v1/brands", brands);
	app.use("/api/v1/products", products);
	app.use("/api/v1/upload", upload);
	app.use("/api/v1/auth", auth);
	// insert data
	app.use("/api/v1/insert", insert);
};

export default routes;
